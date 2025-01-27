from __future__ import with_statement
import logging
from logging import config
from logging.config import fileConfig
from alembic import context
from sqlalchemy import pool
from sqlalchemy import create_engine
from app.database import Base  # Burada app.database'den Base'i import ediyoruz

# Loggers
# logging yapılandırmasını bir dosyadan alıyoruz (örneğin, logging.ini)
fileConfig('logging.ini')  # logging yapılandırma dosyasının yolu
logger = logging.getLogger('alembic.env')

# Base class for models
target_metadata = Base.metadata

def run_migrations_online():
    # Veritabanı URL'sini alıyoruz
    connectable = create_engine(
        context.config.get_main_option("sqlalchemy.url"),
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

def run_migrations_offline():
    url = context.config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
    )

    with context.begin_transaction():
        context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
