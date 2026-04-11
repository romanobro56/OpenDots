#!/usr/bin/env python3
"""CLI: Generate letter/number/symbol images using League Spartan."""

import sys

from src.pins.generators.letters import download_font, generate_all, generate_test


def main():
    download_font()
    if "--all" in sys.argv:
        generate_all()
    else:
        generate_test()


if __name__ == "__main__":
    main()
