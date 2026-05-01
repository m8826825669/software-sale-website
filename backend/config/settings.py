from pathlib import Path
from decouple import config, Csv
from datetime import timedelta
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY', default='django-insecure-change-me-in-production-use-strong-key')
DEBUG = config('DEBUG', default=True, cast=bool)
#ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=Csv())

ALLOWED_HOSTS = ['157.245.248.210', 'www.vexenlabs.com', 'vexenlabs.com', 'api.vexenlabs.com']

DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'invoice',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'django_filters',
]

LOCAL_APPS = [
    'apps.accounts',
    'apps.products',
    'apps.orders',
    'apps.licenses',
    'apps.downloads',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [BASE_DIR / 'templates'],
    'APP_DIRS': True,
    'OPTIONS': {'context_processors': [
        'django.template.context_processors.debug',
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
    ]},
}]

WSGI_APPLICATION = 'config.wsgi.application'

# ── Database — SQLite by default, PostgreSQL via DATABASE_URL env var ─────────
DATABASES = {
    'default': dj_database_url.config(
        default=f'sqlite:///{BASE_DIR / "db.sqlite3"}'
    )
}

AUTH_USER_MODEL = 'accounts.User'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', 'OPTIONS': {'min_length': 8}},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ── REST Framework ────────────────────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {'anon': '100/hour', 'user': '1000/hour'},
}

# ── JWT ───────────────────────────────────────────────────────────────────────
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# ── CORS ─────────────────────────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000,http://127.0.0.1:3000',
    cast=Csv(),
)
CORS_ALLOW_CREDENTIALS = True

# ── Cache — Redis in production, dummy/locmem in development ─────────────────
REDIS_URL = config('REDIS_URL', default='')

if REDIS_URL:
    try:
        import django_redis  # noqa
        CACHES = {
            'default': {
                'BACKEND': 'django_redis.cache.RedisCache',
                'LOCATION': REDIS_URL,
                'OPTIONS': {'CLIENT_CLASS': 'django_redis.client.DefaultClient'},
            }
        }
    except ImportError:
        CACHES = {'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}}
else:
    # Development fallback — in-memory cache (no Redis needed locally)
    CACHES = {'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}}

# ── Razorpay ──────────────────────────────────────────────────────────────────
RAZORPAY_KEY_ID     = config('RAZORPAY_KEY_ID',     default='rzp_test_XXXXXX')
RAZORPAY_KEY_SECRET = config('RAZORPAY_KEY_SECRET',  default='XXXXXX')

# ── Email ─────────────────────────────────────────────────────────────────────
EMAIL_BACKEND      = config('EMAIL_BACKEND',      default='django.core.mail.backends.console.EmailBackend')
EMAIL_HOST         = config('EMAIL_HOST',         default='smtp.gmail.com')
EMAIL_PORT         = config('EMAIL_PORT',         default=587, cast=int)
EMAIL_USE_TLS      = True
EMAIL_HOST_USER    = config('EMAIL_HOST_USER',    default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@softcraft.in')

# ── Security (production only) ────────────────────────────────────────────────
if not DEBUG:
    SECURE_BROWSER_XSS_FILTER         = True
    SECURE_CONTENT_TYPE_NOSNIFF        = True
    SECURE_HSTS_SECONDS                = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS     = True
    SECURE_HSTS_PRELOAD                = True
    SECURE_SSL_REDIRECT                = True
    SESSION_COOKIE_SECURE              = True
    CSRF_COOKIE_SECURE                 = True
    X_FRAME_OPTIONS                    = 'DENY'

# ── App settings ──────────────────────────────────────────────────────────────
SITE_NAME  = config('SITE_NAME',  default='SoftCraft Solutions')
SITE_URL   = config('SITE_URL',   default='https://vexenlabs.com')
SUPPORT_EMAIL = config('SUPPORT_EMAIL', default='support@softcraft.in')

DOWNLOAD_TOKEN_EXPIRY_HOURS = 2
MAX_DOWNLOADS_PER_LICENSE   = 5
