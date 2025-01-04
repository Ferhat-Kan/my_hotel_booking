from pydantic import BaseModel, root_validator, ValidationError
from typing import Union
import datetime
from app.models.booking import BookingStatus


class BookingBase(BaseModel):
    user_id: int
    room_id: int
    guest_name: str
    check_in_date: datetime.date
    check_out_date: datetime.date
    status: BookingStatus = BookingStatus.PENDING


class BookingCreate(BaseModel):
    user_id: int
    room_id: int
    guest_name: str
    check_in_date: Union[str, datetime.date]  # Accept both string and date types
    check_out_date: Union[str, datetime.date]  # Accept both string and date types
    status: BookingStatus = BookingStatus.PENDING

    @root_validator(pre=True)
    def validate_dates(cls, values):
        check_in_date = values.get("check_in_date")
        check_out_date = values.get("check_out_date")

        try:
            # Convert check_in_date to datetime.date if it's a string
            if isinstance(check_in_date, str):
                try:
                    check_in_date = datetime.datetime.strptime(check_in_date, "%Y-%m-%d").date()
                except ValueError:
                    check_in_date = datetime.datetime.strptime(check_in_date, "%d/%m/%Y").date()

            # Convert check_out_date to datetime.date if it's a string
            if isinstance(check_out_date, str):
                try:
                    check_out_date = datetime.datetime.strptime(check_out_date, "%Y-%m-%d").date()
                except ValueError:
                    check_out_date = datetime.datetime.strptime(check_out_date, "%d/%m/%Y").date()

            # Validation: check-in date cannot be in the past
            if check_in_date < datetime.date.today():
                raise ValueError("Check-in date cannot be in the past")

            # Validation: check-out date must be after check-in date
            if check_in_date >= check_out_date:
                raise ValueError("Check-out date must be after check-in date")

            # Update values with validated dates
            values["check_in_date"] = check_in_date
            values["check_out_date"] = check_out_date

        except ValueError as e:
            raise ValueError(f"Invalid date format or value: {e}")

        return values


class Booking(BookingBase):
    id: int

    class Config:
        orm_mode = True
