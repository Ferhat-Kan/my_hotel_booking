from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

class RoomBase(BaseModel):
    hotel_id: int
    room_number: str
    room_type: str
    price_per_night: float
    is_available: bool = True

class RoomCreate(RoomBase):
    pass

class Room(RoomBase):
    id: int

    class Config:
        orm_mode = True 