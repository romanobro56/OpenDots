"""Shared image processing operations for the pins-accessibility pipeline."""

import os

from PIL import Image, ImageEnhance, ImageOps
from pillow_heif import register_heif_opener

register_heif_opener()


def load_image(path: str) -> Image.Image:
    return Image.open(path)


def to_monochrome(img: Image.Image) -> Image.Image:
    return ImageOps.grayscale(img)


def increase_contrast(img: Image.Image, factor: float = 2.0) -> Image.Image:
    return ImageEnhance.Contrast(img).enhance(factor)


def invert(img: Image.Image) -> Image.Image:
    return ImageOps.invert(img)


def trim_whitespace(img: Image.Image) -> Image.Image:
    bbox = img.getbbox()
    if bbox is None:
        return img
    return img.crop(bbox)


def reorient(img: Image.Image, orientation: str) -> Image.Image:
    w, h = img.size
    is_landscape = w >= h

    if orientation == "landscape" and not is_landscape:
        return img.rotate(90, expand=True)
    elif orientation == "portrait" and is_landscape:
        return img.rotate(90, expand=True)
    return img


def guess_mime_type(path: str) -> str:
    ext = os.path.splitext(path)[1].lower()
    return {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".heic": "image/heic",
        ".webp": "image/webp",
        ".gif": "image/gif",
    }.get(ext, "image/png")
