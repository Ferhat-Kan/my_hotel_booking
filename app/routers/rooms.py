from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import SessionLocal
from .. import models
from ..schemas.room import Room, RoomCreate, RoomBatchCreate

router = APIRouter(
    prefix="/rooms",
    tags=["rooms"]
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=Room)
def create_room(room: RoomCreate, db: Session = Depends(get_db)):
    hotel = db.query(models.Hotel).filter(models.Hotel.id == room.hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    
    db_room = models.Room(**room.dict())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

@router.get("/", response_model=List[Room])
def read_rooms(hotel_id: Optional[int] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.Room)
    if hotel_id is not None:
        query = query.filter(models.Room.hotel_id == hotel_id)
    return query.offset(skip).limit(limit).all()

@router.get("/{room_id}", response_model=Room)
def read_room(room_id: int, db: Session = Depends(get_db)):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room

@router.put("/{room_id}", response_model=Room)
def update_room(room_id: int, room: RoomCreate, db: Session = Depends(get_db)):
    db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    if room.hotel_id != db_room.hotel_id:
        hotel = db.query(models.Hotel).filter(models.Hotel.id == room.hotel_id).first()
        if not hotel:
            raise HTTPException(status_code=404, detail="Hotel not found")
    
    for key, value in room.dict().items():
        setattr(db_room, key, value)
    
    db.commit()
    db.refresh(db_room)
    return db_room

@router.delete("/{room_id}")
def delete_room(room_id: int, db: Session = Depends(get_db)):
    db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not db_room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    db.delete(db_room)
    db.commit()
    return {"message": "Room deleted successfully"}

@router.post("/batch", response_model=List[Room], status_code=status.HTTP_201_CREATED)
def create_rooms_batch(rooms: RoomBatchCreate, db: Session = Depends(get_db)):
    db_rooms = []
    for room_data in rooms.rooms:
        db_room = models.Room(**room_data.dict())
        db.add(db_room)
        db_rooms.append(db_room)
    db.commit()
    for db_room in db_rooms:
        db.refresh(db_room)
    return db_rooms 

@router.post("/{room_id}/upload-image")
async def upload_room_image(room_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    file_location = f"static/room_images/{room_id}_{file.filename}"
    with open(file_location, "wb") as buffer:
        buffer.write(await file.read())

    room.photo_url = file_location
    db.commit()
    return {"info": f"File '{file.filename}' uploaded successfully", "url": file_location}

# @router.get("/hotels/{hotel_id}/rooms", response_model=List[Room])
# def read_rooms(hotel_id: int, db: Session = Depends(get_db)):
#     rooms = db.query(models.Room).filter(models.Room.hotel_id == hotel_id).all()
#     if not rooms:
#         raise HTTPException(status_code=404, detail="Rooms not found")
#     return rooms
