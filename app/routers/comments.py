from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import SessionLocal
from .. import models
from ..schemas.comment import Comment, CommentCreate
from ..routers.users import get_current_user

router = APIRouter(
    prefix="/comments",
    tags=["comments"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=Comment)
def create_comment(
    comment: CommentCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Check if booking exists
    booking = db.query(models.Booking).filter(models.Booking.id == comment.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    db_comment = models.Comment(**comment.dict(), user_id=current_user.id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/", response_model=List[Comment])
def read_comments(booking_id: int, db: Session = Depends(get_db)):
    comments = db.query(models.Comment).filter(models.Comment.booking_id == booking_id).all()
    return comments 