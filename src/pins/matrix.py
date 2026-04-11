"""Convert a PIL image to an 8x12 binary matrix."""

from PIL import Image

MATRIX_ROWS = 8
MATRIX_COLS = 12


def image_to_matrix(
    img: Image.Image,
    rows: int = MATRIX_ROWS,
    cols: int = MATRIX_COLS,
    threshold: int = 128,
) -> list[list[int]]:
    resized = img.resize((cols, rows), Image.Resampling.LANCZOS)
    pixels = list(resized.tobytes())

    matrix = []
    for r in range(rows):
        row = []
        for c in range(cols):
            val = pixels[r * cols + c]
            row.append(1 if val >= threshold else 0)
        matrix.append(row)
    return matrix


def format_matrix(matrix: list[list[int]]) -> str:
    return "\n".join(" ".join(str(v) for v in row) for row in matrix)
