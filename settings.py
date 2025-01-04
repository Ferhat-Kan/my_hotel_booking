INSTALLED_APPS = [
    # diğer uygulamalar...
    'corsheaders',
]

MIDDLEWARE = [
    # diğer middleware'ler...
    'corsheaders.middleware.CorsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # frontend'inizin adresi
]
