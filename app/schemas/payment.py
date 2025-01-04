from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Literal

class PaymentBase(BaseModel):
    booking_id: int
    amount: float
    payment_method: Literal["credit_card", "debit_card", "paypal"] = "credit_card"  # Varsayılan: "credit_card"
    status: str = "pending"

class PaymentCreate(PaymentBase):
    id: Optional[int] = None
    payment_date: Optional[datetime] = None

class Payment(PaymentBase):
    id: int
    payment_date: datetime

    class Config:
        orm_mode = True
