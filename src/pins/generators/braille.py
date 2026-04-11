"""Generate braille letter/number/symbol images by drawing dots programmatically."""

import os
import string

from PIL import Image, ImageDraw

from .common import IMG_WIDTH, IMG_HEIGHT

OUTPUT_DIR = os.path.join("output", "letters")

# Standard 6-dot braille positions:
#   1 4
#   2 5
#   3 6

BRAILLE_DOTS = {
    'a': [1],       'b': [1,2],     'c': [1,4],     'd': [1,4,5],   'e': [1,5],
    'f': [1,2,4],   'g': [1,2,4,5], 'h': [1,2,5],   'i': [2,4],     'j': [2,4,5],
    'k': [1,3],     'l': [1,2,3],   'm': [1,3,4],   'n': [1,3,4,5], 'o': [1,3,5],
    'p': [1,2,3,4], 'q': [1,2,3,4,5], 'r': [1,2,3,5], 's': [2,3,4], 't': [2,3,4,5],
    'u': [1,3,6],   'v': [1,2,3,6], 'w': [2,4,5,6], 'x': [1,3,4,6], 'y': [1,3,4,5,6],
    'z': [1,3,5,6],
}

# Digits use the same dot patterns as letters a-j in standard braille
DIGIT_DOTS = {
    '1': [1],       '2': [1,2],     '3': [1,4],     '4': [1,4,5],   '5': [1,5],
    '6': [1,2,4],   '7': [1,2,4,5], '8': [1,2,5],   '9': [2,4],     '0': [2,4,5],
}

SYMBOL_DOTS = {
    'plus':           [2,3,5],
    'minus':          [3,6],
    'division':       [2,5,6],
    'multiplication': [2,3,6],
}

# Dot centre positions on the image canvas.
# The 6 dots are arranged in a 2-col × 3-row grid, centred on the canvas.
# Column centres at 1/3 and 2/3 of width; row centres at 1/4, 1/2, 3/4 of height.
DOT_POSITIONS = {
    1: (1/3, 1/4),
    2: (1/3, 1/2),
    3: (1/3, 3/4),
    4: (2/3, 1/4),
    5: (2/3, 1/2),
    6: (2/3, 3/4),
}

DOT_RADIUS_FRAC = 0.10  # radius as fraction of image width


def _render_braille(dots: list[int], output_dir: str, filename: str) -> None:
    img = Image.new("RGB", (IMG_WIDTH, IMG_HEIGHT), "white")
    draw = ImageDraw.Draw(img)

    radius = int(IMG_WIDTH * DOT_RADIUS_FRAC)

    for dot in dots:
        fx, fy = DOT_POSITIONS[dot]
        cx = int(fx * IMG_WIDTH)
        cy = int(fy * IMG_HEIGHT)
        draw.ellipse(
            [cx - radius, cy - radius, cx + radius, cy + radius],
            fill="black",
        )

    os.makedirs(output_dir, exist_ok=True)
    path = os.path.join(output_dir, filename)
    img.save(path)
    print(f"  Saved {path}  (dots {dots})")


def generate_all() -> None:
    print("\n=== Braille Letters ===")
    for ch in string.ascii_lowercase:
        _render_braille(BRAILLE_DOTS[ch], OUTPUT_DIR, f"braille_{ch}.png")

    print("\n=== Braille Digits ===")
    for ch in string.digits:
        _render_braille(DIGIT_DOTS[ch], OUTPUT_DIR, f"braille_{ch}.png")

    print("\n=== Braille Symbols ===")
    for label, dots in SYMBOL_DOTS.items():
        _render_braille(dots, OUTPUT_DIR, f"braille_{label}.png")

    print("\nDone!")


def generate_test() -> None:
    test_chars = [
        ("a", BRAILLE_DOTS["a"], "braille_a.png"),
        ("b", BRAILLE_DOTS["b"], "braille_b.png"),
        ("g", BRAILLE_DOTS["g"], "braille_g.png"),
        ("1", DIGIT_DOTS["1"],   "braille_1.png"),
        ("+", SYMBOL_DOTS["plus"], "braille_plus.png"),
    ]
    print("Generating braille test images...")
    for _label, dots, fname in test_chars:
        _render_braille(dots, OUTPUT_DIR, fname)
    print("Test generation complete.")
