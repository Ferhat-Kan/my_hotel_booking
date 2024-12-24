from sqlalchemy import Column, Integer, ForeignKey, Date, String, Enum
from sqlalchemy.orm import relationship
import enum
from ..database import Base

class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"))
    guest_name = Column(String)
    check_in_date = Column(Date)
    check_out_date = Column(Date)
    status = Column(String, default=BookingStatus.PENDING)
    
    user = relationship("User", back_populates="bookings")
    room = relationship("Room", back_populates="bookings")
    payment = relationship("Payment", back_populates="booking", uselist=False)
    comments = relationship("Comment", back_populates="booking")