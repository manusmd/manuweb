# Clean Code Rules — manuwebv2

Guidelines for the upcoming refactor. These rules describe how code in this repo should look and behave after cleanup. **No refactoring work starts until this document is approved.**

---

## 1. Scope and discipline

- **One concern per change.** Each refactor PR or commit should address one category (e.g. “split Timeline”, “unify breakpoints”) — not a mixed bag of unrelated edits.
- **Behavior-preserving by default.** Refactors must not change visible UI, scroll behavior, i18n strings, or routes unless explicitly agreed.
- **Verify after every batch:** `npm run ci` must pass before marking a refactor step done.
- **No drive-by changes.** Do not rename, reformat, or “improve” files outside the agreed scope.

---

## 2. File and component size

| Limit          | Rule                                                           |
| -------------- | -------------------------------------------------------------- |
| **~300 lines** | Target max for a single component or hook file                 |
| **~500 lines** | Hard stop — file must be split before adding more logic        |
| **772 lines**  | `Timeline.tsx` is over limit and is a priority split candidate |

**When to split:**

- Extract presentational subcomponents (e.g. timeline panel, job card, scroll dot).
- Move GSAP/animation setup into dedicated hooks (e.g. `useTimelineScroll`).
- Move static data and constants into `src/data/` or colocated `*.constants.ts` files.
- Keep the public export thin: one main component re-exporting or composing children.

**Do not split** purely for the sake of more files — each new module must have a clear, reusable boundary.

---

## 3. Directory and naming conventions

Follow existing layout:

```
src/
  app/           # Next.js App Router pages and layouts
  components/    # UI grouped by domain (about/, blog/, layout/, scroll/, …)
  hooks/         # Shared React hooks
  data/          # Static data (projects, timeline entries, …)
  types/         # Shared TypeScript types
  lib/           # Pure utilities (no React)
  messages/      # next-intl JSON
```

**Rules:**

- **PascalCase** for components (`Timeline.tsx`, `ScrollProgress.tsx`).
- **camelCase** for hooks (`useMediaQuery.ts`), utilities, and handlers.
- **kebab-case** only for non-component assets and route segments (Next.js convention).
- **Colocate** domain-specific pieces under their folder (`components/about/`, not a flat `components/` dump).
- **Barrel files (`index.ts`)** only where they already exist or clearly reduce import noise — do not add barrels everywhere.

---

## 4. React and Next.js patterns

### Client vs server

- `'use client'` only when the file uses hooks, browser APIs, or event handlers.
- Prefer **Server Components** for static content and data fetching; lazy-load heavy client sections with `dynamic()` as in `page.tsx`.

### Imports

- All imports at the **top of the file** — no inline/dynamic imports except `next/dynamic` for code-splitting.
- Order: React/Next → third-party → `@/` aliases → relative → types.

### State and effects

- Prefer **declarative state** over imperative DOM manipulation when possible.
- **Do not duplicate** resize/breakpoint logic — use the existing `useMediaQuery` hook from `@/hooks/useMediaQuery` instead of ad-hoc `window.innerWidth` + `useEffect` + `resize` listeners (currently inconsistent in `ProjectsSection`, `AboutClient`, `Timeline`).
- Shared breakpoints should use consistent values:
  - Mobile: `768px`
  - Tablet / timeline mobile: `1024px`

### Performance

- Keep **below-the-fold** sections dynamically imported (already done on home page).
- Avoid new global listeners without cleanup in `useEffect` return functions.
- Respect `prefers-reduced-motion` via `useMediaQuery('(prefers-reduced-motion: reduce)')` where animations run.

---

## 5. TypeScript

- **No `any`** in new or touched code — use proper types or `unknown` with narrowing.
- Shared shapes live in `src/types/` (e.g. `Project`, timeline entry types).
- Prefer **interfaces** for object shapes that may be extended; **type aliases** for unions and utility types.
- Export types alongside components only when consumed externally; otherwise keep types private to the module.
- Use **exhaustive handling** for discriminated unions and string literal unions (switch + `never` fallback).

---

## 6. Styling (Tailwind CSS v4)

- Use **Tailwind utility classes** in JSX — no new CSS modules unless matching an existing pattern.
- Prefer **design tokens** from theme (`bg-background`, `text-foreground`, `border-primary`) over hardcoded colors.
- Responsive layout: Tailwind breakpoints (`sm:`, `md:`, `lg:`) in markup where possible; JS breakpoints only when behavior (not just layout) differs.
- Keep `globals.css` limited to: font imports, Tailwind import, CSS variables, and truly global rules. No component-specific styles there.

---

## 7. i18n (next-intl)

- **All user-facing copy** comes from `src/messages/{locale}.json` via `useTranslations` or server `getTranslations`.
- No hardcoded UI strings in components (except dev-only or easter-egg content if intentionally English-only).
- When adding keys, update **both** `en.json` and `de.json`.

---

## 8. Data and duplication

- **Single source of truth** for static lists (projects, timeline jobs, nav items).
- Do not maintain the same project in both `src/data/projects.ts` and inline arrays in section components.
- Constants (breakpoints, section IDs, animation durations) should be defined once and imported — not magic numbers scattered across files.

---

## 9. Dead code and unused modules

- Remove **unused components, hooks, and exports** when confirmed unused (e.g. audit whether `SectionProgress.tsx` duplicates `ScrollProgress.tsx` and consolidate if so).
- Remove commented-out code blocks — git history is the archive.
- Remove unused imports and variables (enforced by ESLint `@typescript-eslint/no-unused-vars`).

---

## 10. Comments and documentation

- **No comments** in code unless you explicitly request them for a specific area.
- Prefer **self-explanatory names** over explanatory comments.
- Markdown docs (like this file) belong in `docs/` for process and architecture — not inline in source.

---

## 11. Error handling and edge cases

- Handle **SSR safely**: guard `window` / `document` access (`typeof window !== 'undefined'` or client-only components).
- Do not add heavy error boundaries or try/catch everywhere — only where failures are realistic (e.g. async data, third-party scripts).
- Avoid speculative fallbacks for impossible states.

---

## 12. Testing and quality gates

Before approving a refactor batch as complete:

1. `npm run type-check`
2. `npm run lint:strict`
3. `npm run format:check`
4. `npm run build`
5. Manual smoke test: home scroll sections, about timeline (mobile + desktop), projects modal, locale switch, theme toggle

---

## 13. Suggested refactor order (for approval)

Proposed sequence after you approve these rules:

1. **Unify breakpoints** — replace duplicate resize listeners with `useMediaQuery`; centralize breakpoint constants.
2. **Consolidate scroll progress** — merge or clearly separate `ScrollProgress` vs `SectionProgress`; remove dead code.
3. **Split `Timeline.tsx`** — extract data, hooks, and subcomponents (~772 → multiple files under `components/about/`).
4. **Deduplicate project data** — single source in `src/data/projects.ts`, sections consume it.
5. **Trim large section components** — `Header.tsx`, `HeroSection.tsx`, easter-egg games only if still over limits after above steps.
6. **Hook consolidation** — review overlap between `useAnimations.ts` and `useAnimationVariants.ts`.

Each step = one reviewable unit. Stop and check in after each if you prefer smaller increments.

---

## 14. Out of scope (unless you ask)

- Visual redesign or new features
- Enabling stricter ESLint `react-hooks/*` rules (currently off for legacy patterns)
- Adding a test suite from scratch
- Migrating away from GSAP, Framer Motion, or Three.js
- Changing deployment, CI, or Appwrite/backend setup

---

## Approval

Reply with **approve**, **approve with changes**, or specific edits to this document. Refactoring begins only after approval.
