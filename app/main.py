from fastapi import FastAPI
from .routers import (
    users,      # Kullanıcı yönetimi
    hotels,     # Otel yönetimi
    rooms,      # Oda yönetimi
    bookings,   # Rezervasyon yönetimi
    payments,   # Ödeme işlemleri
    comments    # Yorumlar
)
from . import models
from .database import engine

# Create FastAPI instance
app = FastAPI(
    title="Hotel Booking API",
    description="A simple hotel booking API",
    version="1.0.0"
)

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(users.router)      # /users - Kimlik doğrulama ve kullanıcı işlemleri
app.include_router(hotels.router)     # /hotels - Otel CRUD işlemleri
app.include_router(rooms.router)      # /rooms - Oda CRUD işlemleri
app.include_router(bookings.router)   # /bookings - Rezervasyon işlemleri
app.include_router(payments.router)   # /payments - Ödeme işlemleri
app.include_router(comments.router)   # /comments - Yorum işlemleri

@app.get("/")
def read_root():
    return {"message": "Welcome to Hotel Booking API"} 