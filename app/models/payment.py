from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"))
    amount = Column(Float)
    payment_date = Column(DateTime, default=datetime.utcnow)
    payment_method = Column(String(50))
    status = Column(String(20), default="pending")

    booking = relationship("Booking", back_populates="payment")