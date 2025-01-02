from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import SessionLocal
from .. import models
from ..schemas.hotel import Hotel, HotelCreate, HotelBatchCreate

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
    query = db.query(models.Hotel)
    if location:
        query = query.filter(models.Hotel.location.ilike(f"%{location}%"))
    hotels = query.offset(skip).limit(limit).all()
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

    # Resim dosyasının adını otel ismiyle ilişkilendirin
    image_filename = f"{hotel.name.replace(' ', '_').lower()}.jpg"
    hotel.image_url = f"/static/images/{image_filename}"
    
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

@router.post("/{hotel_id}/upload-image")
async def upload_hotel_image(hotel_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    db_hotel = db.query(models.Hotel).filter(models.Hotel.id == hotel_id).first()
    if db_hotel is None:
        raise HTTPException(status_code=404, detail="Hotel not found")

    # Save the file to a directory
    file_location = f"static/images/{file.filename}"
    with open(file_location, "wb") as buffer:
        buffer.write(await file.read())

    # Update the hotel's image_url
    db_hotel.image_url = file_location
    db.commit()
    db.refresh(db_hotel)

    return {"info": f"file '{file.filename}' saved at '{file_location}'"}

@router.post("/batch", response_model=List[Hotel], status_code=status.HTTP_201_CREATED)
def create_hotels_batch(hotels: HotelBatchCreate, db: Session = Depends(get_db)):
    db_hotels = []
    for hotel_data in hotels.hotels:
        db_hotel = models.Hotel(**hotel_data.dict())
        db.add(db_hotel)
        db_hotels.append(db_hotel)
    db.commit()
    for db_hotel in db_hotels:
        db.refresh(db_hotel)
    return db_hotels

@router.get("/", response_model=List[Hotel])
def read_hotels(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    hotels = db.query(models.Hotel).offset(skip).limit(limit).all()
    return hotels