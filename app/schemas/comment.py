from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CommentBase(BaseModel):
    booking_id: int
    content: str
    rating: int  # 1-5 arası puanlama

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    user_id: int
    created_at: datetime
    is_approved: bool = False

    class Config:
        orm_mode = True 