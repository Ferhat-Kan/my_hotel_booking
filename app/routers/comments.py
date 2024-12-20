from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import SessionLocal
from .. import models
from ..schemas.comment import Comment, CommentCreate
from ..routers.users import oauth2_scheme

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
    current_user: str = Depends(oauth2_scheme)
):
    # Get user
    user = db.query(models.User).filter(models.User.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if booking exists and belongs to user
    booking = db.query(models.Booking).filter(
        models.Booking.id == comment.booking_id,
        models.Booking.guest_name == user.full_name
    ).first()
    if not booking:
        raise HTTPException(
            status_code=404, 
            detail="Booking not found or does not belong to you"
        )

    # Validate rating
    if not 1 <= comment.rating <= 5:
        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5"
        )

    db_comment = models.Comment(
        **comment.dict(),
        user_id=user.id,
        is_approved=user.is_admin  # Admin yorumları otomatik onaylanır
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/", response_model=List[Comment])
def read_comments(
    skip: int = 0, 
    limit: int = 100, 
    booking_id: Optional[int] = None,
    approved_only: bool = True,
    db: Session = Depends(get_db)
):
    query = db.query(models.Comment)
    if booking_id:
        query = query.filter(models.Comment.booking_id == booking_id)
    if approved_only:
        query = query.filter(models.Comment.is_approved == True)
    comments = query.offset(skip).limit(limit).all()
    return comments

@router.get("/{comment_id}", response_model=Comment)
def read_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment

@router.put("/{comment_id}/approve")
def approve_comment(
    comment_id: int, 
    db: Session = Depends(get_db),
    current_user: str = Depends(oauth2_scheme)
):
    # Check if user is admin
    user = db.query(models.User).filter(models.User.email == current_user).first()
    if not user or not user.is_admin:
        raise HTTPException(status_code=403, detail="Only admins can approve comments")

    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    comment.is_approved = True
    db.commit()
    return {"message": "Comment approved successfully"}

@router.delete("/{comment_id}")
def delete_comment(
    comment_id: int, 
    db: Session = Depends(get_db),
    current_user: str = Depends(oauth2_scheme)
):
    # Get user
    user = db.query(models.User).filter(models.User.email == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")

    # Check if user is admin or comment owner
    if not user.is_admin and comment.user_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")

    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully"} 