# CLAUDE.md

## Project

- **Framework**: Astro 6 with React 19 and Tailwind CSS v4
- **Deploy target**: Cloudflare Pages via GitHub Actions. Build workflow at
  `.github/workflows/build.yml` runs `npm ci && npm run build` on every push
  and PR and uploads `dist/` as an artifact. The Cloudflare Pages deploy step
  itself is not yet wired — add a follow-up job with `cloudflare/pages-action`
  and `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` secrets when the
  Cloudflare project exists.

## Toolchain

Versions confirmed with `npm ls` on 2026-04-14.

### ESLint

- `eslint@9.39.4`
- `@eslint/js@9.39.4`
- `typescript-eslint@8.58.2` (also provides `@typescript-eslint/parser` and
  `@typescript-eslint/eslint-plugin`)
- `eslint-plugin-astro@1.7.0`
- `eslint-plugin-react@7.37.5`
- `eslint-plugin-react-hooks@7.0.1`
- `eslint-plugin-jsx-a11y@6.10.2`

Flat config at `eslint.config.js`. Ignores `dist/`, `.astro/`, `_legacy/`, and
`node_modules/`.

### Prettier

- `prettier@3.8.2`
- `prettier-plugin-astro@0.14.1`
- `prettier-plugin-tailwindcss@0.7.2`

Config at `.prettierrc` with the exact settings requested: `printWidth: 80`,
`tabWidth: 2`, `useTabs: false`, `singleQuote: true`, `semi: true`,
`trailingComma: 'es5'`. Ignores in `.prettierignore`
(`dist`, `.astro`, `_legacy`, `public`, video files, lockfile).

### Stylelint

- `stylelint@17.7.0`
- `stylelint-config-standard@40.0.0`

Config at `stylelint.config.js`. Runs against `src/**/*.css` only. Stylelint
17 can't parse `.astro` frontmatter without a custom syntax adapter, and the
project keeps all meaningful CSS in `src/styles/global.css` anyway — inline
`style=""` attributes in Astro templates are checked by Prettier instead.
See _Tailwind v4_ note below for why `stylelint-config-tailwindcss` is not
used.

### Pre-commit

- `simple-git-hooks@2.13.1`
- `lint-staged@16.4.0`

Chosen over husky because it's a single binary (~50 kB) with no postinstall
overhead and it reads hook config straight from `package.json`. Hook runs
`npx lint-staged`, which applies `eslint --fix` + `prettier --write` to staged
`.js/.jsx/.ts/.tsx/.astro`; `stylelint --fix` + `prettier --write` to staged
`.css`; and `prettier --write` to staged markdown/JSON/YAML.

The hook is wired (`package.json` `simple-git-hooks` block + `prepare` script),
but the project is **not yet a git repository** on this machine. Run
`git init && npx simple-git-hooks` once the repo is initialized to activate.

## How to run tools locally

```bash
npm run lint          # ESLint
npm run lint:fix      # ESLint with auto-fix
npm run format        # Prettier write
npm run format:check  # Prettier check (no writes)
npm run stylelint     # Stylelint on src/**/*.css
npm run stylelint:fix # Stylelint with auto-fix
npm run check         # astro check (TypeScript across .astro)
npm run qa            # format:check + lint + stylelint + check (all four)
npm run build         # astro build
npm run dev           # astro dev
```

All four QA tools currently pass clean on the codebase.

## Known issues and decisions

### ESLint 10 vs ESLint 9

The original brief specified `eslint@^10.0.2`. ESLint 10 is published, but
`eslint-plugin-react` (peer: `^9.7`) and `eslint-plugin-jsx-a11y` (peer: `^9`)
have not updated their peer ranges. Installing ESLint 10 requires
`--legacy-peer-deps` and produces a fragile tree. Pinned to ESLint 9.39
(latest 9.x) until the React plugin ecosystem catches up.

### Stylelint and Tailwind v4

`stylelint-config-tailwindcss` is **not** installed. That package targets
Tailwind v3 conventions (PostCSS plugin pipeline). This project uses Tailwind
v4 via `@tailwindcss/vite`, which introduces new at-rules (`@theme`,
`@utility`, `@custom-variant`, `@source`, `@reference`, `@plugin`) that
predate the config package.

Instead, `stylelint.config.js` extends only `stylelint-config-standard` and
disables `import-notation` (its auto-fix rewrites `@import 'tailwindcss'`
to `@import url('tailwindcss')`, which Tailwind v4's Vite plugin does not
recognize — breaks the entire stylesheet silently) and overrides
`at-rule-no-unknown` to allow the full set of Tailwind v4 at-rules
(`tailwind`, `apply`, `layer`, `theme`, `variants`, `responsive`, `screen`,
`utility`, `custom-variant`, `source`, `plugin`, `reference`, `config`). A few
rules that conflict with the codebase's clamp-heavy, arbitrary-value style are
disabled: `no-descending-specificity`, `selector-class-pattern`,
`custom-property-pattern`, `declaration-block-no-redundant-longhand-properties`,
`value-keyword-case`, `media-feature-range-notation`.

### ESLint `react-hooks/set-state-in-effect`

React hooks v7 ships a new rule that flags
`setState` calls inside `useEffect`. Two call sites are intentional
post-hydration capability checks (detecting `hover: hover` and
`prefers-reduced-motion` after the Astro island mounts — these cannot run
during SSR, and a lazy `useState` initializer would cause a hydration
mismatch). Both sites carry a targeted `eslint-disable-next-line` with a
justification comment.

## Deploy notes

### Hero video

`public/hero.mp4` is a 540p re-encode of the original drone footage (20 MB).
Kept under Cloudflare Pages' 25 MB per-file limit. Original 50 MB source
preserved at `_legacy/202604132110.mov` — re-encode with
`avconvert --preset Preset960x540 --source <input> --output public/hero.mp4`
if the file needs regenerating. The `_legacy/` directory is git-ignored, so
the source won't bloat the repo, but it does live on this workstation only.

### `npm audit` status (as of 2026-04-14)

- 0 critical, 0 high
- 5 moderate, all transitive via `@astrojs/check` →
  `@astrojs/language-server` → `volar-service-yaml` → `yaml-language-server`
  → `yaml@<2.9.0` (stack-overflow on deeply nested collections). Dev-only,
  does not ship to Cloudflare. Not a deploy blocker. Revisit when Astro's
  check toolchain updates upstream.
- `npm audit fix --force` would downgrade `@astrojs/check` to 0.9.2 — do not
  run.

## Deferred

Per scope agreement, the following are not yet configured:

- **Cloudflare Pages deploy job** — the build workflow produces an artifact;
  wiring the actual deploy step needs the Cloudflare project + API token
- **Vitest** — add once there is logic worth unit-testing
- **Playwright** — add once interactive behaviors (nav, mobile menu, cursor
  reveal, GSAP hero) are stable enough to lock down end-to-end
- **pa11y** — add alongside Playwright for accessibility assertions on built
  output
- **Lighthouse CI** — add once the Cloudflare Pages URL is live
- **html-validate** — add against `dist/` once the site is out of
  content-churn; Astro output is standards-compliant HTML so scope is small
- **Extended CI** — the current workflow only runs `npm run build`. Adding
  `npm run qa` to gate PRs is the next logical step once a git remote exists.
