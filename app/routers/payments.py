from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import SessionLocal
from .. import models
from ..schemas.payment import Payment, PaymentCreate

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
    # Check if booking exists
    booking = db.query(models.Booking).filter(models.Booking.id == payment.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Allow payment creation without a specific method
    if not payment.payment_method:
        payment.payment_method = "none"  # Default value or logic to handle no payment method
    
    # Create payment
    db_payment = models.Payment(**payment.dict())
    db.add(db_payment)
    
    # Update booking status if payment is completed
    if payment.status == "completed":
        booking.status = "confirmed"
    
    db.commit()
    db.refresh(db_payment)
    return db_payment

@router.get("/", response_model=List[Payment])
def read_payments(
    skip: int = 0, 
    limit: int = 100, 
    booking_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Payment)
    if booking_id:
        query = query.filter(models.Payment.booking_id == booking_id)
    payments = query.offset(skip).limit(limit).all()
    return payments

@router.get("/{payment_id}", response_model=Payment)
def read_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

@router.put("/{payment_id}/complete")
def complete_payment(payment_id: int, db: Session = Depends(get_db)):
    payment = db.query(models.Payment).filter(models.Payment.id == payment_id).first()
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    if payment.status == "completed":
        raise HTTPException(status_code=400, detail="Payment is already completed")
    
    payment.status = "completed"
    
    # Update booking status
    booking = db.query(models.Booking).filter(models.Booking.id == payment.booking_id).first()
    if booking:
        booking.status = "confirmed"
    
    db.commit()
    return {"message": "Payment completed successfully"} 

@router.post("/payments")
def create_payment(payment_data: PaymentCreate, db: Session = Depends(get_db)):
    # Ödeme işlemi mantığı burada
    return {"message": "Payment successful"} 