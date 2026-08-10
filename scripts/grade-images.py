#!/usr/bin/env python3
"""
One grade across every client photo so they read as one set instead of an upload folder.

Always run from the untouched originals in .cache/raw/ — never from an exported .webp,
or the grade stacks on itself.

The look: airy Mediterranean. Blacks lifted a touch so nothing is crushed (matches the
limestone-paper UI), highlights warmed toward sun-bleached stone, saturation pulled back
just enough to sit under a pastel palette. The Blue Cave frames are the exception — that
electric blue IS the product, so they keep their saturation and stay cool.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / ".cache" / "raw"
OUT = ROOT / "public" / "img"

MAX_W = 2000
QUALITY = 82

# src stem -> output name
RENAME = {
    "CarmenBoatDubrovnik": "boat-fort-lovrjenac",
    "threeIslandTourDubrovnik": "boat-old-port",
    "DJI_20240613122512_0975_D-min-1": "boat-mlini-coast",
    "DJI_0266-scaled": "catamaran-pier",
    "DJI_0526-scaled": "dubrovnik-aerial",
    "SliderVivado": "dubrovnik-walls-sea",
    "regularBoatLineVivado": "line-catamaran",
    "bluecave1-1": "cave-mouth",
    "blueCaveTourDubrovnik": "cave-entrance",
    "bluecave2": "cave-swimmers",
    "bluecave4": "cave-beach",
    "bluecave3": "coast-pines",
    "vivado-11": "lunch-on-deck",
    "vivado-25": "gulls-astern",
    "vivado-34": "captain-helm",
    "vivado-2": "guests-deck",
    "vivado-17": "island-harbour",
    "CarmenRenovation": "carmen-restoration",
    "vivadoekipa": "the-family",
}

# Frames whose subject is the blue itself — keep it.
KEEP_BLUE = {"cave-mouth", "cave-entrance", "cave-swimmers", "cave-beach"}


def warm_matrix(strength: float) -> np.ndarray:
    """Channel mixer whose rows each sum to 1 — warms white balance without tinting.

    A flat tint monochromes the image; this preserves luminance and just shifts
    the balance toward stone/sun.
    """
    s = strength
    return np.array(
        [
            [1.0 + 0.045 * s, 0.010 * s, -0.055 * s],
            [0.008 * s, 1.0 + 0.006 * s, -0.014 * s],
            [-0.010 * s, -0.030 * s, 1.0 + 0.040 * s],
        ],
        dtype=np.float32,
    )


def grade(img: Image.Image, keep_blue: bool) -> Image.Image:
    a = np.asarray(img.convert("RGB"), dtype=np.float32) / 255.0

    # White balance. Cave frames get only a whisper so the blue stays electric.
    a = a.reshape(-1, 3) @ warm_matrix(0.35 if keep_blue else 1.0).T
    a = a.reshape(img.size[1], img.size[0], 3)

    # Lift blacks + gentle highlight rolloff. Restrained on purpose: push this too far
    # and everything washes out — dark hulls and wet rock go grey and lose presence.
    a = a * 0.95 + 0.031

    # Saturation. The sea is the product, so this is a nudge, not a desaturation.
    lum = (a * np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)).sum(axis=2, keepdims=True)
    a = lum + (a - lum) * (1.0 if keep_blue else 0.93)

    # Very slight S-curve for contrast the flat lift just took away.
    a = np.clip(a, 0.0, 1.0)
    a = a * a * (3.0 - 2.0 * a) * 0.14 + a * 0.86

    # Fine grain. Different cameras across different years stop announcing themselves
    # once they share a noise floor.
    rng = np.random.default_rng(7)
    a += rng.normal(0.0, 0.0055, a.shape).astype(np.float32)

    return Image.fromarray((np.clip(a, 0.0, 1.0) * 255.0).round().astype(np.uint8), "RGB")


def main() -> int:
    if not RAW.is_dir():
        print(f"missing originals: {RAW}", file=sys.stderr)
        return 1

    OUT.mkdir(parents=True, exist_ok=True)
    written = 0

    for src in sorted(RAW.iterdir()):
        if src.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
            continue
        name = RENAME.get(src.stem)
        if name is None:
            print(f"  skip (unmapped) {src.name}")
            continue

        img = Image.open(src)
        img = grade(img, keep_blue=name in KEEP_BLUE)

        if img.width > MAX_W:
            img = img.resize((MAX_W, round(img.height * MAX_W / img.width)), Image.LANCZOS)

        dest = OUT / f"{name}.webp"
        img.save(dest, "WEBP", quality=QUALITY, method=6)
        written += 1
        print(f"  {src.name:44s} -> {dest.name:26s} {img.width}x{img.height}  {dest.stat().st_size // 1024}kB")

    print(f"\n{written} images graded into {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
