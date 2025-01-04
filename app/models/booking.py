from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from app.database import Base

# Booking Status Enum
class BookingStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    guest_name = Column(String, nullable=False)
    check_in_date = Column(Date, nullable=False)
    check_out_date = Column(Date, nullable=False)
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING, nullable=False)

    # Relationships
    user = relationship("User", back_populates="bookings")
    room = relationship("Room", back_populates="bookings")
    payment = relationship("Payment", back_populates="booking", uselist=False)  # One-to-one relationship
    comments = relationship("Comment", back_populates="booking")

    # Methods
    def is_active(self):
        """Check if the booking is active (PENDING or CONFIRMED)."""
        return self.status in [BookingStatus.PENDING, BookingStatus.CONFIRMED]

    def is_completed(self):
        """Check if the booking is completed."""
        return self.status == BookingStatus.COMPLETED

    def is_cancelled(self):
        """Check if the booking is cancelled."""
        return self.status == BookingStatus.CANCELLED

    def is_overlapping(self, other_booking):
        """Check if the booking overlaps with another booking."""
        return not (
            self.check_out_date <= other_booking.check_in_date or 
            self.check_in_date >= other_booking.check_out_date
        )

    @classmethod
    def is_room_available(cls, session, room_id: int, check_in: Date, check_out: Date):
        """Check if a room is available for the given date range."""
        overlapping_booking = session.query(cls).filter(
            cls.room_id == room_id,
            cls.check_out_date > check_in,
            cls.check_in_date < check_out,
            cls.status != BookingStatus.CANCELLED
        ).first()
        return overlapping_booking is None
