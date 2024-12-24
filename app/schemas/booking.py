from pydantic import BaseModel
from datetime import date
from typing import Optional
from .room import Room

class BookingBase(BaseModel):
    user_id: int
    room_id: int
    guest_name: str
    check_in_date: date
    check_out_date: date
    status: str = "pending"

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: int
    room: Optional[Room] = None

    class Config:
        orm_mode = True 