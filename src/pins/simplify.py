"""Two-step image simplification: identify subject, then generate a simple B&W icon."""

import sys

from google import genai
from google.genai import types

from .image_processing import guess_mime_type


def identify_subject(client: genai.Client, image_path: str) -> str:
    with open(image_path, "rb") as f:
        image_data = f.read()

    mime_type = guess_mime_type(image_path)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            types.Content(
                parts=[
                    types.Part.from_text(
                        text=(
                            "What is the main subject of this image? "
                            "Reply with ONLY a short noun phrase, like 'a horse' or 'a coffee cup'. "
                            "No explanation, no punctuation, just the subject."
                        )
                    ),
                    types.Part.from_bytes(data=image_data, mime_type=mime_type),
                ]
            )
        ],
    )

    subject = response.text.strip()
    print(f"Identified subject: {subject}")
    return subject


def generate_simple_icon(client: genai.Client, subject: str, output_path: str) -> None:
    prompt = (
        f"Generate an image of {subject} using only a few large black rectangles on a white background. "
        f"This image will be downscaled to 8 by 12 pixels, so it MUST be recognizable at that resolution. "
        f"No curves, no thin lines, no detail whatsoever. Think chunky pixel art at the lowest possible resolution. "
        f"Only pure black (#000000) and pure white (#FFFFFF). No anti-aliasing, no gradients, no gray."
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[types.Content(parts=[types.Part.from_text(text=prompt)])],
        config=types.GenerateContentConfig(
            response_modalities=["image", "text"],
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data is not None:
            with open(output_path, "wb") as f:
                f.write(part.inline_data.data)
            print(f"Simplified image saved to: {output_path}")
            return

    print("Error: No image was generated in the response.", file=sys.stderr)
    if response.text:
        print(f"Model response: {response.text}", file=sys.stderr)
    sys.exit(1)
