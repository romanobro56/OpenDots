#!/usr/bin/env python3
"""CLI: Convert an image to an 8x12 binary matrix."""

import argparse
import sys

from src.pins.image_processing import (
    increase_contrast,
    invert,
    load_image,
    reorient,
    to_monochrome,
    trim_whitespace,
)
from src.pins.matrix import format_matrix, image_to_matrix


def main():
    parser = argparse.ArgumentParser(
        description="Convert an image to an 8x12 binary matrix."
    )
    parser.add_argument("image", help="Path to input image (PNG, JPEG, or HEIC)")
    parser.add_argument(
        "--orientation",
        choices=["landscape", "portrait"],
        default=None,
        help="Force output orientation before matrix conversion",
    )
    parser.add_argument(
        "--contrast",
        type=float,
        default=2.0,
        help="Contrast enhancement factor (default: 2.0, >1 increases contrast)",
    )
    parser.add_argument(
        "--threshold",
        type=int,
        default=128,
        help="Brightness threshold for 0/1 mapping (0-255, default: 128)",
    )
    parser.add_argument(
        "--invert",
        action="store_true",
        help="Invert the image before thresholding (swap light/dark)",
    )
    parser.add_argument(
        "--trim",
        action="store_true",
        help="Crop whitespace from the edges of the image before matrix conversion",
    )

    args = parser.parse_args()

    try:
        img = load_image(args.image)
    except FileNotFoundError:
        print(f"Error: file not found: {args.image}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error loading image: {e}", file=sys.stderr)
        sys.exit(1)

    img = to_monochrome(img)
    img = increase_contrast(img, args.contrast)

    if args.invert:
        img = invert(img)

    if args.trim:
        img = trim_whitespace(img)

    if args.orientation:
        img = reorient(img, args.orientation)

    matrix = image_to_matrix(img, threshold=args.threshold)
    print(format_matrix(matrix))


if __name__ == "__main__":
    main()
