#!/usr/bin/env python3
"""CLI: Identify an image's subject, then generate a simple B&W icon for 8x12 matrix display."""

import argparse
import os
import sys

from dotenv import load_dotenv
from google import genai

from src.pins.simplify import generate_simple_icon, identify_subject

load_dotenv()


def main():
    parser = argparse.ArgumentParser(
        description="Identify an image's subject, then generate a simple B&W icon for 8x12 matrix display."
    )
    parser.add_argument("image", help="Path to input image")
    parser.add_argument(
        "-o",
        "--output",
        default=None,
        help="Output path for simplified image (default: <input>_simplified.png)",
    )

    args = parser.parse_args()

    if not os.path.isfile(args.image):
        print(f"Error: file not found: {args.image}", file=sys.stderr)
        sys.exit(1)

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print(
            "Error: GEMINI_API_KEY environment variable is not set.", file=sys.stderr
        )
        sys.exit(1)

    client = genai.Client(api_key=api_key)

    output = args.output
    if output is None:
        base, _ = os.path.splitext(args.image)
        output = f"{base}_simplified.png"

    subject = identify_subject(client, args.image)
    generate_simple_icon(client, subject, output)


if __name__ == "__main__":
    main()
