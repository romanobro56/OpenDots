# Pins Accessibility

Tools for converting images into 8x12 binary matrix representations for accessible pin displays.

## Project Structure

```
src/pins/                    # Core library
  image_processing.py        # Shared image ops (load, monochrome, contrast, trim, reorient)
  matrix.py                  # Image-to-matrix conversion
  simplify.py                # Gemini-based image simplification
  generators/                # Character image generation
    common.py                # Shared font rendering utilities
    letters.py               # Latin letter/number/symbol generation
    braille.py               # Braille character generation

cli/                         # Command-line entry points
  image_to_matrix.py         # Image → binary matrix
  image_simplify.py          # Image → simplified B&W icon (via Gemini)
  generate_letters.py        # Generate letter images (League Spartan)
  generate_braille.py        # Generate braille images

assets/                      # Static resources
  fonts/                     # Font files (braille, League Spartan)
  samples/                   # Sample input images

output/                      # Generated output
  letters/                   # Generated character images
```

## Setup

```bash
pip install -r requirements.txt
```

For image simplification, set `GEMINI_API_KEY` in a `.env` file.

## Usage

All CLI tools are run from the project root:

```bash
# Image to 8x12 binary matrix
python -m cli.image_to_matrix assets/samples/castle.png

# With options
python -m cli.image_to_matrix photo.png --orientation landscape --contrast 3.0 --threshold 100 --trim --invert

# Simplify an image to a B&W icon via Gemini
python -m cli.image_simplify assets/samples/castle.png

# Generate letter images (test set)
python -m cli.generate_letters

# Generate all letter images
python -m cli.generate_letters --all

# Generate braille images (test set)
python -m cli.generate_braille

# Generate all braille images
python -m cli.generate_braille --all
```
