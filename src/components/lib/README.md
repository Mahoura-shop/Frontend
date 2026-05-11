# External Components & Animations (React Bits)

This directory contains components copied from [React Bits](https://reactbits.dev).

## How to Add a Component

1. Visit https://reactbits.dev
2. Find component you want (e.g., "Image Trail")
3. Click "Copy" on TS-Tailwind variant
4. Paste into a new file: `components/lib/[ComponentName].tsx`
5. Update colors:
   - `#D4A5A5` → `hsl(var(--primary-rose))`
   - `#6B4E71` → `hsl(var(--secondary-plum))`
   - `#C9A875` → `hsl(var(--accent-gold))`
   - `#FFFFFF` → `hsl(var(--background))`
   - `#000000` → `hsl(var(--foreground))`
6. Test in isolation
7. Import in pages: `import { ComponentName } from '@/components/lib/ComponentName'`

## Priority Components for Mahoura

- **Image Trail** — Product image hover effects (Phase 9)
- **Fluid Glass** — Premium card backgrounds (Phase 9)
- **Logo Loop** — Brand logo animations (Phase 9)
- **Flowing Menu** — Navigation animations (Phase 9)

See `docs/reactbits-integration.md` for detailed integration guide.

## License

MIT + Commons Clause — You own the code after copying. Full commercial use OK.

## Installation Alternative

Use CLI for automatic setup:
```bash
npx shadcn@latest add @react-bits/ImageTrail-TS-TW
npx shadcn@latest add @react-bits/FluidGlass-TS-TW
```

But copy-paste gives more control over token colors & dependencies.
