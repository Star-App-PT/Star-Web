# Category icons (Clean, Repair, Services) — spec for your custom icons

Replace the existing yellow glove icons with your own by overwriting these files in this folder:

| Purpose   | Filename          |
|----------|-------------------|
| Cleaning | `icon-clean.png`   |
| Repairs  | `icon-repair.png`  |
| Services | `icon-services.png`|

## Spec

- **Format:** PNG (recommended; supports transparency) or JPEG (only if you want a solid background).
- **Background:** **Transparent (no background)** recommended so icons look good on the white category bar and on cards.
- **Size:** Icons are displayed at **128×88 px** (width × height). For sharp rendering on retina:
  - **Recommended:** **256×176 px** (2×) per image.
  - **Minimum:** 128×88 px.
  - If your design is square, **256×256 px** or **176×176 px** is fine; the app uses `resizeMode="contain"` so they will be letterboxed.
- **Count:** 3 images (one per category: Clean, Repair, Services).

After adding your files, rebuild/refresh the app; no code changes needed.
