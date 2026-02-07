from .settings import *

# Override database voor lokale development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Debug mode
DEBUG = True

# Allow localhost
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

print("✅ Using LOCAL settings with SQLite")
