# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (HMR).
- `npm run build` — type-check (`tsc -b`) then production build.
- `npm run lint` — run ESLint over the project.
- `npm run preview` — preview the production build locally.
- `npx tsc -b` — type-check only, without building.

There is no test runner configured in this project.

## Architecture

- **Stack**: React 19 + TypeScript + Vite, Tailwind CSS v4, react-router v8, react-hook-form + Zod, shadcn (`style: radix-nova`, `baseColor: neutral`) for UI primitives.
- **Path alias**: `@/*` maps to `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`). Always import via `@/...`, not relative paths across top-level folders.
- **Routing** (`src/routes/`): `RootRoute` (`routes/index.tsx`) picks between `PublicRoutes` and `PrivateRoutes` based on an auth flag. `PublicRoutes` currently owns `/` (Landing), `/login` and `/register`; add authenticated screens to `PrivateRoutes` instead. Auth/session state lives in `src/contexts/authContext.tsx` (`AuthProvider`/`useAuth`, backed by `localStorage` via `storage.ts`) and persistence helpers are in `src/services/storage.ts` (localStorage wrappers: `storeData`, `getData`, `removeData`, `clearData`).
- **Screen composition**: pages under `src/pages/<PageName>/index.tsx` are thin — they only lay out `Section` components (e.g. `LoginPage` = `LeftSection` + `LoginRightSection`). `Section` components in `src/components/sections/` hold layout/visual chrome and embed the actual `Form` components from `src/components/form/`. Keep this three-layer split (page → section → form) rather than putting form logic directly in a page or section. Components specific to one feature (not reusable sections/forms) get their own folder instead, e.g. `src/components/skills/` (`SkillRow`, `AddSkillModal`, `EmptyState`, `SkillsSkeleton`) for the Home/skills screen.
- **Forms + validation**: every form has a co-located Zod schema in `src/validators/<kebab-name>-schema.ts`, exporting `<Name>Schema` and `type <Name>FormData = z.infer<typeof <Name>Schema>`. The form component uses `useForm<...FormData>({ resolver: zodResolver(<Name>Schema) })` from `react-hook-form` / `@hookform/resolvers/zod`, and renders field errors from `formState.errors` under each field. Validation messages are written in pt-BR. For a field bound to a native `type="number"` input, register it with `{ valueAsNumber: true }` and keep the Zod field as a plain `z.number()` (avoid `z.coerce.number()`, which breaks `useForm`'s input/output type inference with the resolver).
- **UI primitives** (`src/components/ui/`): shadcn-generated components (`button.tsx`, `input.tsx`, `label.tsx`, `textarea.tsx`, ...). Add new primitives via `npx shadcn add <component>` rather than hand-rolling them, so they stay consistent with the configured style/base color in `components.json`. Compose screens out of these instead of raw HTML elements where an equivalent exists.
- **Styling**: Tailwind utility classes merged via `cn()` from `src/lib/utils.ts` (`clsx` + `tailwind-merge`). Global tokens/theme variables live in `src/index.css`.
- **Theme (dark/light mode)**: `ThemeProvider` (`src/contexts/theme-provider.tsx`, wraps the app in `App.tsx`) stores the theme (`"dark" | "light" | "system"`) in `localStorage` (`vite-ui-theme`) and toggles a `dark`/`light` class on `document.documentElement`. `src/index.css` defines `@custom-variant dark (&:is(.dark *))`, so every `dark:` utility resolves relative to the nearest `.dark` ancestor. **Never hardcode a `dark` (or `light`) class on a page/section root** — it permanently pins that subtree to one theme regardless of the toggle (this caused the Landing page to ignore the theme switch). Let the class on `<html>` cascade instead. `ModeToggle` (`src/components/mode-toggle.tsx`) is the light/dark/system dropdown, used in page headers.
- **Toasts**: `useToast()` from `src/contexts/toastContext.tsx` (`showToast(type, message)`) drives the toast notifications rendered via `src/components/ui/toast.tsx`; use it for success/error feedback after async actions instead of ad-hoc inline banners.

## Conventions for new screens

When adding a new screen, follow the pattern established by the Login screen:

1. **Page** — `src/pages/<PageName>/index.tsx`, PascalCase folder, named export `export function <Name>Page()`. Only composes section components; no form/validation logic here.
2. **Sections** — `src/components/sections/<kebab-name>-section.tsx`, named export. Owns layout, spacing, and copy chrome (headings via `HeaderForm` or similar), and renders the form component(s) it needs.
3. **Form** — `src/components/form/<kebab-name>-form.tsx`, named export `export function <Name>Form()`. Wires up `react-hook-form` + the Zod schema, renders `Label` + `Input` (or other `ui/` primitives) per field with inline error messages, and a submit `Button`.
4. **Schema** — `src/validators/<kebab-name>-schema.ts` with `<Name>Schema` (Zod) and `<Name>FormData` (inferred type). Keep validation messages in pt-BR.
5. **Shared prop types** for a component group are colocated as `types.ts` in that component's folder (see `src/components/form/types.ts`), not inline in each file.
6. Register the new page's route in `PublicRoutes` or `PrivateRoutes` depending on whether it requires auth.
7. File names are kebab-case; component names are PascalCase; exports are named exports (not default), except top-level `App.tsx`.
8. User-facing copy is in pt-BR.

After implementing a screen, run `npm run lint` and `npx tsc -b`, and verify the actual UI flow in the browser (not just that it compiles).
