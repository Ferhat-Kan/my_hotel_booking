import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine
from app import models
from passlib.context import CryptContext
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin():
    db = SessionLocal()
    try:
        # Veritabanını temizle
        models.Base.metadata.drop_all(bind=engine)
        models.Base.metadata.create_all(bind=engine)
        
        # Admin kullanıcı oluştur
        admin_user = models.User(
            email="admin@example.com",
            full_name="Admin User",
            hashed_password=pwd_context.hash("admin123"),
            is_admin=True,
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        # Kontrol et
        created_admin = db.query(models.User).filter_by(email="admin@example.com").first()
        logger.info(f"Admin created successfully: {created_admin.email} (is_admin: {created_admin.is_admin})")
        
        return admin_user
    
    except Exception as e:
        logger.error(f"Error creating admin: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Creating admin user...")
    admin = create_admin()
    logger.info("Done!") 