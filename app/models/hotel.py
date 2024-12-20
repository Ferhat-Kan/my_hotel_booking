from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from ..database import Base

class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    location = Column(String(200))
    rating = Column(Float)
    description = Column(String(500))
    
    rooms = relationship("Room", back_populates="hotel")