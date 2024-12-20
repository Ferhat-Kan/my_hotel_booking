from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    rating = Column(Integer)  # 1-5 arası puanlama
    created_at = Column(DateTime, default=datetime.utcnow)
    is_approved = Column(Boolean, default=False)

    booking = relationship("Booking", back_populates="comments")
    user = relationship("User", back_populates="comments") 