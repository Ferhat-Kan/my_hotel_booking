from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

class RoomBase(BaseModel):
    hotel_id: int
    room_number: str
    room_type: str
    price_per_night: float
    is_available: bool = True
    image_url: Optional[str] = None

class RoomCreate(RoomBase):
    hotel_id: int

class Room(RoomBase):
    id: int
    hotel_id: int

    class Config:
        orm_mode = True 