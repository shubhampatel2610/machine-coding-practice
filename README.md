# Machine Coding - Practice Hub

A React + TypeScript boilerplate for practicing frontend machine-coding
interview rounds. The homepage shows a searchable grid of components; each
tile opens a fully working, self-contained implementation behind a shared
"back to home" header. The goal is a consistent scaffold (routing, theming,
folder conventions) so a new component can be dropped in without re-solving
project setup every time.

## What's inside

Currently implemented:

- **Star Rating** - hover & click driven star rating widget
- **Nested Comments** - recursive comment thread with replies

More components (Counter, Todo List, Accordion, Debounce Search, Stopwatch,
OTP Input, etc.) can be added following the same pattern - see
[Adding a new machine-coding component](#adding-a-new-machine-coding-component)
below.

## Tech Stacks

- React 19 + TypeScript
- Vite for dev server / build
- Tailwind CSS v4 (CSS-first config via `@theme` in `src/index.css`)
- SCSS (via `sass`) for component-level styles, sharing tokens with Tailwind
- React Router v7 for client-side routing
- lucide-react for icons

## Getting started

Requires Node `^18.0.0 || ^20.0.0 || >=22.0.0`.

```bash
npm install
npm run dev       # start local dev server
npm run build     # type-check + production build → dist/
npm run preview   # preview the production build locally
npm run lint      # run oxlint
```

## Adding a new machine-coding component

1. Create `src/pages/<Name>/` with `<Name>.tsx`, `<Name>.logic.ts` (state/hook),
   and `<Name>.scss`.
2. Wrap the page in `<PageHeader title="..." />` for the shared back/home nav.
3. Register the route in `src/routes/AppRoutes.tsx`.
4. Add an entry to `GRID_ITEMS` in `src/utils/constants.ts` - the homepage
   tile appears automatically, no other file needs to change.

## Design notes

- Dark, IDE-inspired theme: near-black background, mint/amber/rose accents.
- Typography: Space Grotesk (display), Inter (body), JetBrains Mono (data/badges).
- Grid tiles are styled as miniature code-editor windows (traffic-light dots +
  mono file index) as the app's signature visual detail.
- Color/type tokens are defined once in `src/index.css` (`@theme`, for Tailwind
  utilities) and mirrored in `src/utils/global.scss` (SCSS variables, for
  component-level styles) - keep both in sync when changing the palette.
