from pydantic import BaseModel, conint, constr
from datetime import datetime


class CommentBase(BaseModel):
    booking_id: int
    content: constr(min_length=5, max_length=500) # type: ignore
    rating: conint(ge=1, le=5) # type: ignore


class CommentCreate(CommentBase):
    pass


class Comment(CommentBase):
    id: int
    user_id: int
    created_at: datetime
    is_approved: bool = False

    class Config:
        orm_mode = True
