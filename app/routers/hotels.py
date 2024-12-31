<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException, status
=======
from fastapi import APIRouter, Depends, HTTPException, Query
>>>>>>> 9cbd3427 (Update .gitignore to exclude unnecessary files)
from sqlalchemy.orm import Session
from typing import List, Optional
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

# Create a new hotel
@router.post("/", response_model=Hotel, status_code=status.HTTP_201_CREATED)
def create_hotel(hotel: HotelCreate, db: Session = Depends(get_db)):
    # Check if hotel already exists (you can customize this as needed)
    db_hotel = db.query(models.Hotel).filter(models.Hotel.name == hotel.name).first()
    if db_hotel:
        raise HTTPException(status_code=400, detail="Hotel with this name already exists")

    # Create and add new hotel to the database
    db_hotel = models.Hotel(**hotel.dict())
    db.add(db_hotel)
    db.commit()
    db.refresh(db_hotel)
    return db_hotel

# Get a list of hotels with optional pagination
@router.get("/", response_model=List[Hotel])
def get_hotels(location: Optional[str] = Query(None), skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    if location:
        hotels = db.query(models.Hotel).filter(models.Hotel.location.ilike(f"%{location}%")).offset(skip).limit(limit).all()
    else:
        hotels = db.query(models.Hotel).offset(skip).limit(limit).all()
    return hotels

# Get details of a single hotel by ID
@router.get("/{hotel_id}", response_model=Hotel)
def read_hotel(hotel_id: int, db: Session = Depends(get_db)):
    db_hotel = db.query(models.Hotel).filter(models.Hotel.id == hotel_id).first()
    if db_hotel is None:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return db_hotel

# Update an existing hotel by ID
@router.put("/{hotel_id}", response_model=Hotel)
def update_hotel(hotel_id: int, hotel: HotelCreate, db: Session = Depends(get_db)):
    db_hotel = db.query(models.Hotel).filter(models.Hotel.id == hotel_id).first()
    if db_hotel is None:
        raise HTTPException(status_code=404, detail="Hotel not found")

    # Update hotel fields based on the provided data
    for key, value in hotel.dict().items():
        setattr(db_hotel, key, value)

    db.commit()
    db.refresh(db_hotel)
    return db_hotel

# Delete an existing hotel by ID
@router.delete("/{hotel_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_hotel(hotel_id: int, db: Session = Depends(get_db)):
    db_hotel = db.query(models.Hotel).filter(models.Hotel.id == hotel_id).first()
    if db_hotel is None:
        raise HTTPException(status_code=404, detail="Hotel not found")

    db.delete(db_hotel)
    db.commit()
    return {"message": "Hotel deleted successfully"}

