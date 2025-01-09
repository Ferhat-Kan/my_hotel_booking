from fastapi import APIRouter, Depends, HTTPException, Query
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
    print("-----1--------------", comment)
    # Check if booking exists
    booking = db.query(models.Booking).filter(models.Booking.id == comment.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Ensure the booking belongs to the current user
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only comment on your own bookings")

    # Ensure the user hasn't already commented on this booking
    existing_comment = db.query(models.Comment).filter(
        models.Comment.booking_id == comment.booking_id,
        models.Comment.user_id == current_user.id
    ).first()
    if existing_comment:
        raise HTTPException(status_code=400, detail="You have already commented on this booking")

    db_comment = models.Comment(**comment.dict(), user_id=current_user.id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment


@router.get("/", response_model=List[Comment])
def read_comments(
    booking_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=100),
    db: Session = Depends(get_db)
):
    comments = db.query(models.Comment).filter(
        models.Comment.booking_id == booking_id,
        models.Comment.is_approved == True
    ).offset(skip).limit(limit).all()
    return comments


@router.put("/{comment_id}/approve", response_model=Comment)
def approve_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to approve comments")

    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    comment.is_approved = True
    db.commit()
    db.refresh(comment)
    return comment
