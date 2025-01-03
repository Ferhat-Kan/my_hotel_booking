from pydantic import BaseModel, Field, root_validator
import datetime
from app.models.booking import BookingStatus

# BookingCreate: Kullanıcıdan rezervasyon oluşturma verilerini almak için kullanılan schema
class BookingCreate(BaseModel):
    room_id: int
    guest_name: str
    check_in_date: str  # Tarih tipi 'str' olarak alınıyor
    check_out_date: str  # Tarih tipi 'str' olarak alınıyor
    payment_method: str
    status: BookingStatus = BookingStatus.PENDING

    @root_validator(pre=True)
    def check_dates(cls, values):
        check_in_date_str = values.get("check_in_date")
        check_out_date_str = values.get("check_out_date")

        # Tarihlerin geçerli formatta olup olmadığını kontrol et
        try:
            # DD/MM/YYYY formatında tarih parse et
            check_in_date = datetime.datetime.strptime(check_in_date_str, "%d/%m/%Y").date()
            check_out_date = datetime.datetime.strptime(check_out_date_str, "%d/%m/%Y").date()

            # Kontrol: check-in date'in geçmişte olmaması
            if check_in_date < datetime.date.today():
                raise ValueError("Check-in date cannot be in the past")

            # Kontrol: check-out date'in check-in date'inden sonra olması
            if check_in_date >= check_out_date:
                raise ValueError("Check-out date must be after check-in date")

            values["check_in_date"] = check_in_date
            values["check_out_date"] = check_out_date

        except ValueError as e:
            raise ValueError(f"Invalid date format. Use DD/MM/YYYY. Error: {e}")

        return values

# BookingBase: Temel rezervasyon bilgilerini içeren schema
class BookingBase(BaseModel):
    user_id: int
    room_id: int
    guest_name: str
    check_in_date: datetime.date
    check_out_date: datetime.date
    status: BookingStatus = BookingStatus.PENDING

# BookingCreate: Kullanıcıdan yeni rezervasyon oluşturma verisini almak için kullanılan schema
class BookingCreate(BookingBase):
    pass

# BookingUpdate: Mevcut rezervasyonu güncellemek için kullanılan schema
class BookingUpdate(BookingBase):
    pass

# Booking: Rezervasyon verisi döndürülürken kullanılan schema
class Booking(BookingBase):
    id: int

    class Config:
        from_attributes = True
