from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import SessionLocal
from .. import models
from ..schemas.payment import Payment, PaymentCreate
from ..models.booking import Booking, BookingStatus

router = APIRouter(
    prefix="/payments",
    tags=["payments"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=Payment)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    """
    Creates a new payment entry and updates the booking status to "PENDING" if necessary.
    """
    try:
        # Create a new payment
        db_payment = models.Payment(**payment.dict())
        db.add(db_payment)
        db.commit()
        db.refresh(db_payment)

        # Check booking status and update if necessary
        booking = db.query(Booking).filter(Booking.id == payment.booking_id).first()
        if booking and booking.status != BookingStatus.CONFIRMED.value:
            booking.status = "PENDING"
            db.commit()  # Ensure commit after booking status update

        return db_payment
    except Exception as e:
        print(f"Error creating payment: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/", response_model=List[Payment])
def read_payments(
    skip: int = 0, 
    limit: int = 100, 
    booking_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieves a list of payments, optionally filtered by booking ID.
    """
    query = db.query(models.Payment)
    if booking_id:
        query = query.filter(models.Payment.booking_id == booking_id)
    payments = query.offset(skip).limit(limit).all()
    return payments

@router.get("/{payment_id}", response_model=Payment)
def read_payment(payment_id: int, db: Session = Depends(get_db)):
    """
    Retrieves a single payment by its ID.
    """
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@router.put("/{payment_id}/complete")
def complete_payment(payment_id: int, db: Session = Depends(get_db)):
    """
    Completes a payment and updates the associated booking status to "confirmed".
    """
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")

    if payment.status == BookingStatus.COMPLETED.value:
        raise HTTPException(status_code=400, detail="Payment is already completed")

    payment.status = BookingStatus.COMPLETED.value

    # Update booking status
    booking = db.query(models.Booking).filter(models.Booking.id == payment.booking_id).first()
    if booking:
        booking.status = BookingStatus.CONFIRMED.value
       
    room = db.query(models.Room).filter(models.Room.id == booking.room_id).first() 
    if room:
        room.is_available = False
    
    db.commit()  # Ensure commit after updating payment and booking
    return {"message": "Payment completed successfully"}

@router.post("/process", response_model=Payment)
def process_and_complete_payment(payment_data: PaymentCreate, db: Session = Depends(get_db)):
    """
    Processes a payment and updates the booking status accordingly.
    """
    # Simulate payment processing logic
    payment_successful = True  # Replace with actual payment gateway logic

    # Retrieve the booking
    booking = db.query(models.Booking).filter(models.Booking.id == payment_data.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Update the booking status based on payment result
    if payment_successful:
        booking.status = BookingStatus.CONFIRMED.value
    else:
        booking.status = "cancelled"

    # Create payment record
    db_payment = models.Payment(**payment_data.dict(), status="completed" if payment_successful else "failed")
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)

    # Commit the booking status update
    db.commit()  # Ensure commit after updating booking status

    return db_payment
