from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PaymentBase(BaseModel):
    booking_id: int
    amount: float
    payment_method: str
    status: str = "pending"

class PaymentCreate(PaymentBase):
    pass

class Payment(PaymentBase):
    id: int
    payment_date: datetime

    class Config:
        orm_mode = True 