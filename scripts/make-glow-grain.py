"""Reproducible, native-pixel grain for dark gradients (no runtime filter)."""
from pathlib import Path
from random import Random
from PIL import Image

out = Path(__file__).resolve().parents[1] / 'public/assets/glow-grain.png'
rng = Random(20261011)
image = Image.new('RGBA', (256, 256))
# Zero-centred luminance variation; overlay blending affects the background only.
image.putdata([(v, v, v, 20) for v in (rng.randrange(96, 160) for _ in range(256 * 256))])
image.quantize(colors=64, method=Image.Quantize.FASTOCTREE).save(out, optimize=True)
print(f'{out.name}: {out.stat().st_size} bytes')
