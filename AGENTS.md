<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **code-base-nextjs** (741 symbols, 1290 relationships, 45 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({search_query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/code-base-nextjs/context` | Codebase overview, check index freshness |
| `gitnexus://repo/code-base-nextjs/clusters` | All functional areas |
| `gitnexus://repo/code-base-nextjs/processes` | All execution flows |
| `gitnexus://repo/code-base-nextjs/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->

# Project Guide — Next.js Base

## Read first

- This repository is the default Next.js base used to start product websites.
- Read [`docs/AI_AGENT_GUIDE.md`](docs/AI_AGENT_GUIDE.md) before changing project structure, authentication, API access, images/media, page scaffolding, or deployment configuration.
- Treat the current source and configuration as the final authority. If this guide differs from the code, report the mismatch and update the relevant documentation with the code change.
- The GitNexus index may be stale. Check its freshness before relying on graph results, and verify important conclusions against current source.

## Required working rules

- Keep route `page.tsx` files short. They should mainly compose sections or call page-level functions. If an existing page contains substantial business logic, tell the developer before extending that pattern.
- Prefer existing shared components and helpers. In particular, review the common modal, Image, SecureImage, loading, paging, skeleton, and error-handling components before creating replacements.
- When the developer names `ModalMessage`, `thongBaoChung`, `thongBao`, or a similar project component as the common notification popup, reuse that exact component. It should display the title `Thông báo`, receive a message, and provide an `X` close button. The developer identifies the canonical component for each project.
- During the `release_html` static-UI stage, do not spend time optimizing the Server/Client Component boundary unless the task requires it. On the standalone `release` branch, prefer Server Components and server-side API access when compatible; use Client Components where browser APIs, state, effects, events, or client libraries require them.
- Use `camelCase` for variables and functions, and `PascalCase` for React components, types, interfaces, and classes. Follow the existing local naming convention for files and folders.
- Keep API functions under `services/` and shared TypeScript request/response models under `types/`.
- Never expose server-only secrets through `NEXT_PUBLIC_*` variables or client code.
- When GitNexus reports HIGH or CRITICAL impact, warn the developer with the direct callers and affected flows before editing.
- Preserve unrelated worktree changes. Do not edit `.env` unless the task explicitly requires it.

## Main entry points

| Task | Start here |
|---|---|
| Add or edit a site route | `app/(site)/`, `scripts/create-page.mjs`, `page-scaffold.config.mjs` |
| Change root providers or global metadata | `app/layout.tsx`, `config/seo.config.ts` |
| Change shared header/footer | `components/header/page.tsx`, `components/footer/page.tsx`, `app/(site)/layout.tsx` |
| Add a modal | `components/hooks/useModal.ts`, `components/common/Modal/ModalProvider.tsx`, `app/appSlice.tsx` |
| Call an API from the client | `services/client-side/axios.config.ts`, `services/client-side/services-api/` |
| Call an API from the server | `services/server-side/api.ts`, `services/server-side/services-api/` |
| Change authentication/token flow | `components/common/Auth/`, `services/server-side/authen.ts`, `security/auth-handler.ts` |
| Change normal image/media behavior | `components/common/Image/Image.tsx`, `constants/base.ts`, `config/public-env.ts` |
| Change private image behavior | `components/common/Image/SecureImage.tsx`, `security/client/sign-helper.ts`, `security/server/sign-helper.ts` |
| Change Tailwind background URLs | `utils/server/render-helper.ts`, `tailwind.config.ts` |
| Change build, base path, or static export | `next.config.ts`, `.env.example`, deployment files |

## Validation

- HTML stage: require `yarn typecheck`, `yarn build`, and a visual check of the changed interface.
- Standalone/integration stage: require `yarn typecheck`, `yarn build`, and verification that the affected request/auth flow passes.
- Run `yarn lint` when the changed scope is covered by ESLint.
- Browser or Playwright testing is performed only when the task explicitly asks for it or the behavior cannot be validated statically.
- IDE diagnostics alone are not proof of a build failure. Report any mismatch and change code only when it is a real issue or the developer requests it.

## Documentation maintenance

- Update `docs/AI_AGENT_GUIDE.md` when changing architecture, folder responsibility, shared workflows, branch/build conventions, or validation commands.
- Update `.env.example` and the relevant guide section when adding or changing environment variables. Never copy real secrets from `.env`.
- Update the owning README or integration guide when changing an SDK or reusable integration whose setup contract changed.
- In every derived repository, inspect the current code and automatically replace base placeholders with project-specific guidance for the project name, API, media, authentication, and deployment flow.
- If a change has no documented contract or architecture impact, no documentation update is required.
