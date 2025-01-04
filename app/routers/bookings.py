from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.models.booking import BookingStatus
from app.database import SessionLocal
from app import models
from app.schemas.booking import Booking, BookingCreate

router = APIRouter(prefix="/bookings", tags=["bookings"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[Booking])
def read_bookings(skip: int = 0, limit: int = 100, room_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.Booking)
    if room_id:
        query = query.filter(models.Booking.room_id == room_id)
    return query.offset(skip).limit(limit).all()

@router.get("/{booking_id}", response_model=Booking)
def read_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.post("/", response_model=Booking)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    try:
        # Oda kontrolü
        print("Fetching room...")
        room = db.query(models.Room).filter(models.Room.id == booking.room_id).first()
        if not room:
            print("Room not found")
            raise HTTPException(status_code=404, detail="Room not found")

        # Oda uygunluk kontrolü
        print(f"Checking room availability for room_id={booking.room_id}")
        if not room.is_available:
            raise HTTPException(status_code=400, detail="Room is not available")

        # Tarih doğrulama
        print(f"Validating dates: check_in_date={booking.check_in_date}, check_out_date={booking.check_out_date}")
        if booking.check_in_date >= booking.check_out_date:
            raise HTTPException(
                status_code=400, 
                detail="Check-in date must be before check-out date"
            )

        if booking.check_in_date < datetime.today().date():
            raise HTTPException(
                status_code=400,
                detail="Check-in date cannot be in the past"
            )

        # Çakışan rezervasyon kontrolü
        print("Checking for overlapping bookings...")
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

        # Rezervasyon oluşturma
        print("Creating booking...")
        db_booking = models.Booking(**booking.dict())
        db.add(db_booking)
        db.commit()
        db.refresh(db_booking)
        return db_booking

    except Exception as e:
        print(f"Error during booking creation: {e}")  # Hata mesajını loglayın
        raise HTTPException(status_code=500, detail="Internal Server Error")


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

@router.delete("/{booking_id}", response_model=dict)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return {"message": "Booking deleted successfully"}
