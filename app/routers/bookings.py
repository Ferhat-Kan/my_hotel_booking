from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime
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
    return [Booking.from_orm(booking) for booking in bookings]

@router.get("/{booking_id}", response_model=Booking)
def read_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Convert dates to strings
    booking_data = {
        "id": booking.id,
        "guest_name": booking.guest_name,
        "check_in_date": booking.check_in_date.strftime("%Y-%m-%d"),
        "check_out_date": booking.check_out_date.strftime("%Y-%m-%d"),
        "room_id": booking.room_id,
        "status": booking.status
    }

    return booking_data

@router.post("/", response_model=Booking, status_code=status.HTTP_201_CREATED)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    # Parse and validate dates
    try:
        check_in_date = datetime.strptime(booking.check_in_date, "%d/%m/%Y").date()
        check_out_date = datetime.strptime(booking.check_out_date, "%d/%m/%Y").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use DD/MM/YYYY.")

    # Ensure check-out is after check-in
    if check_out_date <= check_in_date:
        raise HTTPException(status_code=400, detail="Check-out date must be after check-in date.")

    # Check if room exists
    room = db.query(models.Room).filter(models.Room.id == booking.room_id).first()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    # Check for overlapping bookings
    overlapping_booking = db.query(models.Booking).filter(
        models.Booking.room_id == booking.room_id,
        models.Booking.status != "cancelled",
        models.Booking.check_out_date > check_in_date,
        models.Booking.check_in_date < check_out_date
    ).first()

    if overlapping_booking:
        raise HTTPException(
            status_code=400,
            detail="Room is already booked for the selected dates"
        )

    db_booking = models.Booking(
        check_in_date=check_in_date,
        check_out_date=check_out_date,
        room_id=booking.room_id,
        guest_name=booking.guest_name,
        status="pending payment"
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.put("/{booking_id}/cancel")
def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.status == "cancelled":
        raise HTTPException(status_code=400, detail="Booking is already cancelled")
    
    booking.status = "cancelled"
    db.commit()
    return {"message": "Booking cancelled successfully"} 

@router.delete("/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.status == "confirmed":
        # Process refund logic here
        pass

    booking.status = "cancelled"
    db.commit()
    return {"message": "Booking cancelled successfully"} 