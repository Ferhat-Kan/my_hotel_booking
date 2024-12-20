from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from ..database import SessionLocal
from .. import models
from ..schemas.booking import Booking, BookingCreate

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
    return bookings

@router.get("/{booking_id}", response_model=Booking)
def read_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@router.post("/", response_model=Booking)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    # Check if room exists
    room = db.query(models.Room).filter(models.Room.id == booking.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Check if room is available
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
        models.Booking.status != "cancelled",
        models.Booking.check_out_date > booking.check_in_date,
        models.Booking.check_in_date < booking.check_out_date
    ).first()
    
    if overlapping_booking:
        raise HTTPException(
            status_code=400,
            detail="Room is already booked for these dates"
        )
    
    db_booking = models.Booking(**booking.dict())
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