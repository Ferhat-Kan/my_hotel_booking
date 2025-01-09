from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship, validates
from datetime import datetime
from ..database import Base

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 arası puanlama
    created_at = Column(DateTime, default=datetime.utcnow)
    is_approved = Column(Boolean, default=False)

    booking = relationship("Booking", back_populates="comments")
    user = relationship("User", back_populates="comments")

    @validates("rating")
    def validate_rating(self, key, value):
        if not (1 <= value <= 5):
            raise ValueError("Rating must be between 1 and 5")
        return value

    @validates("content")
    def validate_content(self, key, value):
        if not (5 <= len(value) <= 500):
            raise ValueError("Content must be between 5 and 500 characters")
        return value
