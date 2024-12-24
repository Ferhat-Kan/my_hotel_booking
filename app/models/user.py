from sqlalchemy import Column, Integer, String, Boolean
from ..database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    full_name = Column(String(100))
    hashed_password = Column(String(100))
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, server_default='false')
    comments = relationship("Comment", back_populates="user")
    bookings = relationship("Booking", back_populates="user")