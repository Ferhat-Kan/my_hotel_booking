from pydantic import BaseModel
from typing import List, Optional
from .room import Room

class HotelBase(BaseModel):
    name: str
    location: str
    rating: int
    description: str
    image_url: Optional[str] = None

class HotelCreate(HotelBase):
    pass

class Hotel(HotelBase):
    id: int
    rooms: Optional[List[Room]] = []

    class Config:
        orm_mode = True 