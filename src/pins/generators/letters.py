"""Generate letter/number/symbol images using League Spartan."""

import os
import string

import requests

from .common import render_character

FONT_URL = "https://github.com/theleagueof/league-spartan/raw/master/fonts/ttf/LeagueSpartan-Bold.ttf"
FONT_PATH = os.path.join("assets", "fonts", "LeagueSpartan-Bold.ttf")
OUTPUT_DIR = os.path.join("output", "letters")

UPPERCASE = list(string.ascii_uppercase)
LOWERCASE = list(string.ascii_lowercase)
DIGITS = list(string.digits)
SYMBOLS = {
    "plus": "+",
    "minus": "\u2212",
    "division": "\u00f7",
    "multiplication": "\u00d7",
}


def download_font() -> None:
    if os.path.exists(FONT_PATH):
        print(f"Font already downloaded: {FONT_PATH}")
        return
    print(f"Downloading League Spartan from {FONT_URL} ...")
    resp = requests.get(FONT_URL, timeout=30)
    resp.raise_for_status()
    os.makedirs(os.path.dirname(FONT_PATH), exist_ok=True)
    with open(FONT_PATH, "wb") as f:
        f.write(resp.content)
    print("Font downloaded.")


def filename_for(char: str, label: str | None = None) -> str:
    if label:
        return f"{label}.png"
    if char.isupper():
        return f"{char}_upper.png"
    return f"{char}.png"


def generate_all() -> None:
    print("\n=== Uppercase ===")
    for ch in UPPERCASE:
        render_character(ch, FONT_PATH, OUTPUT_DIR, filename_for(ch))

    print("\n=== Lowercase ===")
    for ch in LOWERCASE:
        render_character(ch, FONT_PATH, OUTPUT_DIR, filename_for(ch))

    print("\n=== Digits ===")
    for ch in DIGITS:
        render_character(ch, FONT_PATH, OUTPUT_DIR, filename_for(ch))

    print("\n=== Symbols ===")
    for label, ch in SYMBOLS.items():
        render_character(ch, FONT_PATH, OUTPUT_DIR, filename_for(ch, label=label))

    print("\nDone!")


def generate_test() -> None:
    test_chars = [
        ("A", filename_for("A")),
        ("a", filename_for("a")),
        ("B", filename_for("B")),
        ("g", filename_for("g")),
        ("7", filename_for("7")),
        ("+", filename_for("+", label="plus")),
        ("\u00f7", filename_for("\u00f7", label="division")),
    ]
    print("Generating test images...")
    for char, fname in test_chars:
        render_character(char, FONT_PATH, OUTPUT_DIR, fname)
    print("Test generation complete.")
