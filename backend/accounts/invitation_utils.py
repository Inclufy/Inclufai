import jwt
from django.conf import settings
from datetime import datetime, timedelta


def generate_invitation_token(invitation_id, email):
    """Generate secure JWT token for invitation"""
    payload = {
        'invitation_id': str(invitation_id),
        'email': email,
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')


def verify_invitation_token(token):
    """Verify and decode invitation token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
