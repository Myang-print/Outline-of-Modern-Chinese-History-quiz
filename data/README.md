# `data/`

Question-bank source, annotations, and generated structured data.

## Structure

- `raw/`: Original source `.txt` files copied into the project.
- `annotations/`: Maintained explanation and exam-point annotations.
- `processed/`: Generated JSON outputs used by the app and for review.

## Update Flow

```bash
npm run annotate:remaining
npm run parse:bank
```

## Update Rules

- Edit `raw/` only when replacing or adding source material.
- Edit `annotations/` when improving explanations or exam points.
- Do not manually edit generated files under `processed/`.
