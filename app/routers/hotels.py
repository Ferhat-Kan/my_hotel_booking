from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import SessionLocal
from .. import models
from ..schemas.hotel import Hotel, HotelCreate

router = APIRouter(
    prefix="/hotels",
    tags=["hotels"]
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=Hotel)
def create_hotel(hotel: HotelCreate, db: Session = Depends(get_db)):
    db_hotel = models.Hotel(**hotel.dict())
    db.add(db_hotel)
    db.commit()
    db.refresh(db_hotel)
    return db_hotel

@router.get("/", response_model=List[Hotel])
def read_hotels(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    hotels = db.query(models.Hotel).offset(skip).limit(limit).all()
    return hotels

@router.get("/{hotel_id}", response_model=Hotel)
def read_hotel(hotel_id: int, db: Session = Depends(get_db)):
    db_hotel = db.query(models.Hotel).filter(models.Hotel.id == hotel_id).first()
    if db_hotel is None:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return db_hotel

@router.put("/{hotel_id}", response_model=Hotel)
def update_hotel(hotel_id: int, hotel: HotelCreate, db: Session = Depends(get_db)):
    db_hotel = db.query(models.Hotel).filter(models.Hotel.id == hotel_id).first()
    if db_hotel is None:
        raise HTTPException(status_code=404, detail="Hotel not found")
    
    for key, value in hotel.dict().items():
        setattr(db_hotel, key, value)
    
    db.commit()
    db.refresh(db_hotel)
    return db_hotel

@router.delete("/{hotel_id}")
def delete_hotel(hotel_id: int, db: Session = Depends(get_db)):
    db_hotel = db.query(models.Hotel).filter(models.Hotel.id == hotel_id).first()
    if db_hotel is None:
        raise HTTPException(status_code=404, detail="Hotel not found")
    
    db.delete(db_hotel)
    db.commit()
    return {"message": "Hotel deleted successfully"}