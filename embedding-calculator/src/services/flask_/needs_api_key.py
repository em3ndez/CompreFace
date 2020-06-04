import functools

from src.exceptions import APIKeyNotSpecifiedError
from src.services.flask_.constants import API_KEY_HEADER


def needs_api_key(f):
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        from flask import request

        if not request.headers.get(API_KEY_HEADER, ''):
            raise APIKeyNotSpecifiedError
        return f(*args, **kwargs)

    return wrapper
