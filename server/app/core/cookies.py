import base64
import tempfile
from app.core.config import settings
_cookie_file = None


def get_cookie_file():

    global _cookie_file

    if _cookie_file:
        return _cookie_file
    
    cookies = settings.YOUTUBE_COOKIES_B64

    if not cookies:
        raise Exception("YOUTUBE_COOKIES_B64 not set")

    tmp = tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".txt",
    )

    tmp.write(base64.b64decode(cookies))
    tmp.close()

    _cookie_file = tmp.name

    return _cookie_file