from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class BookingBase(BaseModel):
    room_id: int
    guest_name: str
    check_in_date: str = Field(..., pattern=r"\d{2}/\d{2}/\d{4}")  # DD/MM/YYYY format
    check_out_date: str = Field(..., pattern=r"\d{2}/\d{2}/\d{4}")  # DD/MM/YYYY format
    status: str = "pending"

class BookingCreate(BaseModel):
    room_id: int
    guest_name: str
    check_in_date: str  # Ensure this matches the format being sent
    check_out_date: str  # Ensure this matches the format being sent
    payment_method: str

class Booking(BookingBase):
    id: int

    class Config:
        orm_mode = True

    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=obj.id,
            room_id=obj.room_id,
            guest_name=obj.guest_name,
            check_in_date=obj.check_in_date.strftime("%d/%m/%Y"),
            check_out_date=obj.check_out_date.strftime("%d/%m/%Y"),
            status=obj.status
        ) 