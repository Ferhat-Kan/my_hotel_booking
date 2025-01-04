from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from app.models.booking import BookingStatus
from ..database import SessionLocal
from .. import models
from ..schemas.booking import Booking, BookingCreate
from ..routers.users import get_current_user  # Kullanıcı doğrulaması için ekleme

router = APIRouter(
    prefix="/bookings",
    tags=["bookings"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rezervasyonları getirme
@router.get("/", response_model=List[Booking])
def read_bookings(
    skip: int = 0, 
    limit: int = 100, 
    room_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Booking)

    if room_id:
        query = query.filter(models.Booking.room_id == room_id)

    bookings = query.offset(skip).limit(limit).all()
    return bookings

# Tek bir rezervasyonu getirme
@router.get("/{booking_id}", response_model=Booking)
def read_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

# Rezervasyon oluşturma
@router.post("/", response_model=Booking)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    try:
        # Check if room exists
        room = db.query(models.Room).filter(models.Room.id == booking.room_id).first()
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")

        # Check room availability
        if not room.is_available:
            raise HTTPException(status_code=400, detail="Room is not available")

        # Validate dates
        if booking.check_in_date >= booking.check_out_date:
            raise HTTPException(
                status_code=400, 
                detail="Check-in date must be before check-out date"
            )

        if booking.check_in_date < date.today():
            raise HTTPException(
                status_code=400,
                detail="Check-in date cannot be in the past"
            )

        # Check for overlapping bookings
        overlapping_booking = db.query(models.Booking).filter(
            models.Booking.room_id == booking.room_id,
            models.Booking.check_out_date > booking.check_in_date,
            models.Booking.check_in_date < booking.check_out_date,
            models.Booking.status != BookingStatus.CANCELLED
        ).first()

        if overlapping_booking:
            raise HTTPException(
                status_code=400,
                detail="Room is already booked for these dates"
            )

        # Create booking
        db_booking = models.Booking(**booking.dict())
        db.add(db_booking)
        db.commit()
        db.refresh(db_booking)
        return db_booking

    except Exception as e:
        print(f"Error during booking creation: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Rezervasyonu iptal etme
@router.put("/{booking_id}/cancel", response_model=Booking)
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.status == BookingStatus.CANCELLED:
        raise HTTPException(status_code=400, detail="Booking is already cancelled")

    booking.status = BookingStatus.CANCELLED
    db.commit()
    db.refresh(booking)
    return booking

# Rezervasyonu silme
@router.delete("/{booking_id}", response_model=dict)
def delete_booking(
    booking_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)  # Kullanıcı doğrulaması
):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Kullanıcının rezervasyonu iptal etme yetkisi olup olmadığını kontrol et
    if booking.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete this booking")

    db.delete(booking)
    db.commit()
    return {"message": "Booking deleted successfully"}
