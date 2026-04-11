#!/usr/bin/env python3
"""CLI: Generate braille letter/number/symbol images."""

import sys

from src.pins.generators.braille import generate_all, generate_test


def main():
    if "--all" in sys.argv:
        generate_all()
    else:
        generate_test()


if __name__ == "__main__":
    main()
