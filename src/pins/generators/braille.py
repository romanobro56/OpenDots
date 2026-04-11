"""Generate braille letter/number/symbol images using a braille font."""

import os
import string

from .common import render_character

FONT_PATH = os.path.join("assets", "fonts", "braille", "BRAILLE1.ttf")
OUTPUT_DIR = os.path.join("output", "letters")

LETTERS = list(string.ascii_lowercase)
DIGITS = list(string.digits)
SYMBOLS = {
    "plus": "+",
    "minus": "-",
    "division": "/",
    "multiplication": "*",
}


def generate_all() -> None:
    print("\n=== Braille Letters ===")
    for ch in LETTERS:
        render_character(ch, FONT_PATH, OUTPUT_DIR, f"braille_{ch}.png")

    print("\n=== Braille Digits ===")
    for ch in DIGITS:
        render_character(ch, FONT_PATH, OUTPUT_DIR, f"braille_{ch}.png")

    print("\n=== Braille Symbols ===")
    for label, ch in SYMBOLS.items():
        render_character(ch, FONT_PATH, OUTPUT_DIR, f"braille_{label}.png")

    print("\nDone!")


def generate_test() -> None:
    test_chars = [
        ("a", "braille_a.png"),
        ("b", "braille_b.png"),
        ("g", "braille_g.png"),
        ("1", "braille_1.png"),
        ("+", "braille_plus.png"),
    ]
    print("Generating braille test images...")
    for char, fname in test_chars:
        render_character(char, FONT_PATH, OUTPUT_DIR, fname)
    print("Test generation complete.")
