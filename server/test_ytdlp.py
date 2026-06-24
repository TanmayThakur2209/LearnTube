from yt_dlp import YoutubeDL
from pprint import pprint

with YoutubeDL(
    {
        "quiet": True,
        "skip_download": True,
    }
) as ydl:

    info = ydl.extract_info(
        "https://www.youtube.com/watch?v=jNQXAC9IVRw",
        download=False,
    )

pprint(info.keys())