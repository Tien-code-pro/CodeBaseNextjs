# AI Agent Guide — `next_base`

## 1. Purpose and authority

`next_base` is the default Next.js foundation for product websites. A derived repository normally customizes routes, UI, API services, environment values, assets, and deployment settings while keeping the shared conventions described here.

Use information in this order when making decisions:

1. The developer's current request.
2. Current source code and configuration on the checked-out branch.
3. Root `AGENTS.md` and module-specific instructions.
4. This guide and other project documentation.
5. GitNexus results, after checking index freshness.

If documentation and code disagree, report the mismatch. For implementation behavior, follow the current code unless the developer asks to restore the documented behavior. Update documentation together with an authorized code change when its contract changes.

## 2. Branch, build, and deployment conventions

The usual workflow for a product created from this base is:

1. The design/HTML team starts from the `release` branch of `next_base`.
2. The new product repository normally creates a branch named `release_html` for the initial interface work.
3. During this early stage, when the repository has little product code and mainly contains static UI, Next.js normally uses `output: "export"` to generate static HTML.
4. When the HTML work is complete, keep `release_html` unchanged as the stored static-interface branch.
5. The development team always creates the product's initial `release` branch from the completed `release_html` branch, so the approved static interface becomes the starting point for integration.
6. The product's `release` branch is the main development and final-product branch. It normally changes to `output: "standalone"` for API integration, server-side authentication, runtime behavior, and deployment.
7. Products commonly have beta and production environments and are deployed through Kubernetes. Feature/sub-branches and backup branches may also exist.

Treat `release_html` as a workflow convention rather than proof of the active build mode. Always inspect the checked-out branch and `next.config.ts`. At the time this guide was created, the `release` branch of `next_base` has `output: "export"`, an empty `basePath`, and `images.unoptimized: true`; this is the starting configuration supplied to the design/HTML team.

Before changing build behavior, inspect:

- `next.config.ts`
- `package.json`
- `.env.example`
- `Dockerfile*`, Jenkins, Kubernetes, or other deployment files present in the derived repository

Build modes affect server-only APIs. Before moving from the HTML stage to API integration or deployment, review features using `next/headers`, server authentication, dynamic route handlers, or runtime server logic, switch the output mode as required, and validate the resulting production build.

## 3. Code map

| Path | Responsibility |
|---|---|
| `app/layout.tsx` | Root App Router layout, metadata, public environment injection, Redux, auth bootstrap, modal provider, and global loading UI |
| `app/(site)/layout.tsx` | Shared site shell containing header, page content, and footer |
| `app/(site)/` | Product routes and route-level layouts/loading/modal files |
| `app/globals.css` | Global styles |
| `app/appSlice.tsx` | Shared Redux state, currently including the modal stack |
| `components/common/` | Reusable Image, SecureImage, modal, loading, paging, skeleton, error, and template components |
| `components/header/` | Shared site header |
| `components/footer/` | Shared site footer |
| `components/hooks/` | Reusable client hooks such as modal, mobile check, and intersection observer |
| `services/client-side/` | Browser Axios configuration and client API functions |
| `services/server-side/` | Server authentication, signed server requests, and server API functions |
| `services/swr/` | SWR helpers and SWR-facing service functions |
| `types/` | Request, response, API, metadata, parameter, and component types |
| `config/public-env.ts` | Public runtime environment contract and client accessor |
| `config/seo.config.ts` | Shared SEO and metadata configuration |
| `constants/base.ts` | Compile-time media mode and media base defaults |
| `utils/` | General helpers and client/server rendering helpers |
| `security/` | Auth handoff, URL handling, and client/server signing helpers |
| `redux/` | Redux store, provider, and typed hooks |
| `public/assets/` | Static local assets served from the site root |
| `scripts/create-page.mjs` | Creates page folders from configured templates and can register Redux slices |
| `scripts/sync-pages.mjs` | Re-syncs generated pages using the page registry |
| `page-scaffold.config.mjs` | Page template roots, route root, registry file, and Redux store target |

## 4. Page and component conventions

Keep `page.tsx` focused on composition. A page such as `/tin-tuc` should resemble:

```tsx
export default function NewsPage() {
  return (
    <section>
      <Filter />
      <NewsList />
    </section>
  );
}
```

Move section UI, browser interaction, state, and business logic into focused components, hooks, and services. If an existing page violates this convention, tell the developer before adding more logic to it so the scope can be decided deliberately.

During the `release_html` stage, focus on completing the static interface. The Server/Client Component boundary does not need special optimization unless it affects the requested UI or build. On the standalone `release` branch, prefer Server Components and server-side API access when compatible. Add `"use client"` when a component needs state, effects, event handlers, browser APIs, client-only stores, or client libraries.

Naming conventions:

- Variables and functions: `camelCase`.
- React components, classes, types, and interfaces: `PascalCase`.
- Constants: follow the existing module, commonly `UPPER_SNAKE_CASE` for configuration constants.
- Files and folders: follow neighboring files to avoid unnecessary naming churn.

Before creating a reusable UI primitive, inspect `components/common/`. Existing building blocks include Image, SecureImage, modal management, loading indicators, paging, skeletons, error UI, infinite scroll, and templates.

## 5. Creating and synchronizing pages

The configured route root is `app/(site)`. Use the existing generator where it fits:

```powershell
yarn page:create <route>
yarn page:create <route> --redux
yarn page:create <route> --dry-run
yarn page:sync --dry-run
```

The generator reads `page-scaffold.config.mjs`, copies a template, records the page in `.page-scaffold.json`, and can register a generated Redux slice in `redux/configure-store.ts`.

Use `--dry-run` first when the route is nested, already exists, or includes Redux. Review generated files before customizing them. Do not manually duplicate generator-managed imports or reducer entries.

## 6. Layout, header, footer, Redux, and modal flow

`app/layout.tsx` owns global providers. Its current order includes public environment injection, Redux `Providers`, authentication bootstrap, modal rendering, and `NextTopLoader`. `app/(site)/layout.tsx` wraps site routes with the shared header and footer.

For a common popup:

1. Check which component the developer identifies as the project's common notification popup. Common names include `ModalMessage`, `thongBaoChung`, and `thongBao`.
2. Use `components/hooks/useModal.ts` to open and close modal content.
3. `app/appSlice.tsx` stores the modal stack.
4. `components/common/Modal/ModalProvider.tsx` renders layers and handles Escape/outside-click behavior.

The common notification popup should display the title `Thông báo`, receive a message from the caller, and provide an `X` button to close it. This base does not yet define its final canonical component. The developer will identify the exact component after it is created; once identified, reuse it for general notifications unless the task requires different behavior. Continue using the shared modal flow for stacking and global state rather than creating an independent modal system.

## 7. Authentication, token, and API flow

The product login UI is normally supplied by special header JavaScript embedded by the site. It is usually enabled when the project moves to the standalone `release` branch. If a product does not require login, the developer will state that explicitly. The scripts are currently present as commented examples in `app/layout.tsx`, so each derived repository must configure and enable the correct project version.

`NEXT_PUBLIC_MODE` is only a temporary switch for the static HTML stage. Its sole purpose is to skip authentication while the design team builds `release_html`. When the standalone `release` branch is created, remove this environment variable and remove the conditional code that depends on it; authentication behavior should then follow the project's actual requirements.

The non-HTML authentication flow is:

```text
login/header cookie
  -> AuthTokenProvider
  -> requireAuth on the server
  -> validate or obtain OAuth token
  -> AuthTokenClient
  -> authHandler
  -> setToken
  -> Axios Authorization header and SecureImage token
```

Key responsibilities:

- In the current base, `components/common/Auth/AuthTokenProvider.tsx` skips authentication when `NEXT_PUBLIC_MODE` is `html`. This condition belongs only to the HTML-stage starting point and must be removed from the standalone product branch.
- `services/server-side/authen.ts` reads the login/auth cookies, validates an existing token, obtains a replacement token when needed, and derives the SecureImage token.
- `components/common/Auth/AuthTokenClient.tsx` hands the server result to client code.
- `security/auth-handler.ts` forwards the token metadata to Axios state.
- `services/client-side/axios.config.ts` keeps access tokens in memory, persists new tokens in cookies, and attaches `Authorization: Bearer <token>` to normal client API requests. When writing a new auth cookie, use `.vtcgame.vn` if the effective auth name is `vtcgame-jwt` or `BASE_WEB` contains `.vtcgame.vn`; otherwise use the current/configured hostname. Keep the resolved cookie domain in one `const`/token field so future domain rules stay centralized.
- `services/server-side/api.ts` builds signed server request payloads and attaches the bearer token.

Client API functions belong under `services/client-side/`; server API functions belong under `services/server-side/`; shared data shapes belong under `types/`. Reuse `AxiosConfig`, `AxiosPlusConfig`, `apiHelper`, or `apiPlusHelper` when their contract matches the target API.

Keep server-only keys such as signing secrets in non-public environment variables. A variable prefixed with `NEXT_PUBLIC_` is exposed to browser code and must never contain a real server secret unless the backend contract explicitly makes that value public.

Do not log full cookies, access tokens, secure-image tokens, secrets, or complete signed payloads.

## 8. Images and media

Use `components/common/Image/Image.tsx` for normal product images. It wraps `next/image`, handles fallback/loading behavior, supports local and remote sources, and applies `basePath` to local sources.

Media mode is currently defined in `constants/base.ts`:

- `MEDIA_MODE = "0"`: use local assets, normally below `public/assets/`.
- `MEDIA_MODE = "1"`: resolve relative media paths against `NEXT_PUBLIC_BASE_MEDIA` for CDN delivery.

Relevant configuration:

- `constants/base.ts`: media mode and server-side media base used by current helpers.
- `config/public-env.ts`: public environment values available to client components.
- `.env.example`: documented environment keys.
- `next.config.ts`: `basePath`, image optimization, and permitted remote hosts.
- `utils/server/render-helper.ts`: server URL helpers, including Tailwind background-image URLs.
- `tailwind.config.ts`: Tailwind background declarations.

Local URLs must work when `basePath` is non-empty. Do not prepend `basePath` twice. Preserve absolute `http://` and `https://` URLs. When changing media behavior, check local mode, CDN mode, absolute URLs, fallback images, and a non-empty base path.

Use `components/common/Image/SecureImage.tsx` only for private images served through the secure-image API. It builds a signed URL using the secure-image token, dimensions, quality, time window, and session information, then caches the resolved URL. Review both client/server signing helpers and the auth token handoff before changing this contract.

## 9. Environment configuration

`.env.example` documents keys and safe placeholder values. `.env` contains machine/environment-specific values and may contain secrets.

When adding an environment variable:

1. Decide whether it is server-only or safe for the browser.
2. Add public values to the typed contract in `config/public-env.ts` when client code needs them.
3. Add a placeholder and explanation to `.env.example`.
4. Update the relevant setup documentation when the variable changes an integration contract.
5. Never copy a real secret into documentation, logs, examples, client code, or a `NEXT_PUBLIC_*` variable.

Common environments are beta and production. Verify exact hosts, secrets, Kubernetes values, and CI inputs in the derived repository rather than copying values from another product.

The signing-key contract uses one name per runtime boundary:

- Server-side signing and secure-image decryption use `process.env.API_SECRET`.
- Client-side request/image signing uses `getClientPublicEnv().NEXT_PUBLIC_API_SECRET`.
- Do not reintroduce legacy signing-key names in source or env templates. Keep `KEY_SECURE_IMAGE` separate.

Do not carry `NEXT_PUBLIC_MODE` into the standalone product branch. Remove it from the environment contract, examples, and all dependent conditions when converting from `release_html` to `release`.

## 10. Helpers and shared behavior

General helpers live under `utils/`, with client/server variants where runtime boundaries matter. Existing or derived projects may include helpers for login, logging, text casing, Facebook sharing, URL rendering, and project-specific behavior.

Before adding a helper:

- Search for an existing equivalent.
- Keep server-only imports out of client modules.
- Give project-specific helpers a clear owning module when they are not truly shared.
- Assess callers before changing a shared helper, because small utility changes can affect many routes.

## 11. Task-to-file workflow

| Work item | Inspect first | Minimum validation |
|---|---|---|
| Add/edit page | `app/(site)/`, page generator config, neighboring route | Typecheck, build, and visual check in HTML stage |
| Change header/footer | site layout and shared header/footer components | Typecheck, build, and visual check |
| Add popup/message | `useModal`, `ModalProvider`, `appSlice`, existing templates | Typecheck and interaction check when requested |
| Add client API | client Axios config, matching service folder, `types/` | Typecheck, build, and affected request check |
| Add server API | server API/auth helpers, matching service folder, `types/` | Typecheck, build, and affected request check |
| Change auth | root layout, auth components, server auth, Axios config | Typecheck, build, and affected auth/request check |
| Change normal image | Image wrapper, media constants, public env, Next config | Typecheck; test local/CDN/basePath cases as applicable |
| Change secure image | SecureImage, auth token flow, signing helpers | Typecheck and authenticated browser test when requested/available |
| Change Tailwind background | Tailwind config and server render helper | Typecheck/build; verify generated URL with basePath |
| Change env/config | `.env.example`, public-env contract, Next config, deployment config | Typecheck and build |
| Change shared helper | helper source plus GitNexus callers/impact | Targeted check for affected flows |

## 12. Validation rules

The current package scripts provide:

```powershell
yarn typecheck
yarn lint
yarn build
yarn verify
```

Validation currently stops at pass/fail for the stage; detailed test cases will be added later.

- HTML stage (`release_html`): run `yarn typecheck`, run `yarn build`, and visually check the changed interface.
- Standalone/integration stage (`release`): run `yarn typecheck`, run `yarn build`, and verify that the affected request/auth flow passes.

Use `yarn verify` when the task also requires the repository's combined typecheck, lint, and build workflow.

An IDE warning can disagree with a successful compiler/build because of stale language-server state or editor configuration. Report that mismatch to the developer. Do not change working code solely to silence an unconfirmed IDE diagnostic unless requested.

The environment may provide Playwright and multiple browser engines. Run browser automation only when explicitly requested. Until detailed test cases are defined, record whether the required stage checks pass and report the failing command or flow when they do not.

## 13. GitNexus workflow

This repository is indexed by GitNexus. Follow the root `AGENTS.md` block for exploration, impact analysis, refactoring, and change detection.

- Check index freshness before relying on graph results.
- If stale, run `node .gitnexus/run.cjs analyze` or the documented fallback.
- Use graph queries to locate flows and dependencies, then verify implementation details in current source.
- Run upstream impact analysis before editing a function, class, or method.
- Warn the developer before editing when risk is HIGH or CRITICAL.
- Run change detection before committing. Do not commit unless the developer asks.

## 14. Documentation maintenance

Update this guide when a change alters:

- the responsibility or location of a major folder;
- page generation or route structure;
- root providers, authentication, API, media, or deployment flows;
- branch/build conventions;
- shared components agents are expected to reuse;
- validation commands or acceptance rules.

Update `.env.example` when the environment contract changes. Update the owning README or setup guide when changing an SDK or reusable integration. When a task has no documented contract or architecture impact, a documentation change is not required.

When working in a product repository created from `next_base`, the agent must inspect the current repository and update this guide without waiting for the developer to enumerate every difference. Replace base-level descriptions with the actual project name, API endpoints and service ownership, media/CDN rules, login requirements, environment strategy, Kubernetes/deployment flow, and project-specific validation. Remove sections and paths that do not exist in the derived repository. Mark information as unknown instead of inventing a value when it cannot be verified from source, configuration, or developer instructions.

Keep documentation actionable. For each rule, state where to start, what contract to preserve, and how to validate it. Avoid copying large source listings or a complete directory tree because both become stale quickly.
