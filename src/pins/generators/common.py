"""Shared utilities for character image generation."""

import os

from PIL import Image, ImageDraw, ImageFont

IMG_WIDTH = 800
IMG_HEIGHT = 1200
PADDING = 40


def find_best_font_size(
    draw: ImageDraw.ImageDraw,
    char: str,
    font_path: str,
    max_width: int,
    max_height: int,
) -> int:
    lo, hi = 10, 2000
    best = lo
    while lo <= hi:
        mid = (lo + hi) // 2
        font = ImageFont.truetype(font_path, mid)
        bbox = draw.textbbox((0, 0), char, font=font)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        if w <= max_width and h <= max_height:
            best = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return best


def render_character(char: str, font_path: str, output_dir: str, filename: str) -> None:
    img = Image.new("RGB", (IMG_WIDTH, IMG_HEIGHT), "white")
    draw = ImageDraw.Draw(img)

    max_w = IMG_WIDTH - 2 * PADDING
    max_h = IMG_HEIGHT - 2 * PADDING
    font_size = find_best_font_size(draw, char, font_path, max_w, max_h)
    font = ImageFont.truetype(font_path, font_size)

    bbox = draw.textbbox((0, 0), char, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (IMG_WIDTH - text_w) / 2 - bbox[0]
    y = (IMG_HEIGHT - text_h) / 2 - bbox[1]

    draw.text((x, y), char, fill="black", font=font)

    os.makedirs(output_dir, exist_ok=True)
    path = os.path.join(output_dir, filename)
    img.save(path)
    print(f"  Saved {path}  (font size {font_size}, glyph {text_w}x{text_h})")
