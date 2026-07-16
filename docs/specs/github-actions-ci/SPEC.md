# Feature: GitHub Actions CI

## Intent

Every pull request targeting `master` automatically runs ESLint, oxlint, TypeScript type checking, and the Jest unit test suite, blocking merge on any failure.

## Context

- **Problem statement:** No CI pipeline exists. The `.github/` directory is absent (confirmed; no files found under that path). Code quality checks run only via the Husky pre-commit hook locally (`npx lint-staged` in `.husky/pre-commit`), leaving PRs unverified on GitHub.
- **Current code:**
  - `eslint.config.js` — flat config using `eslint-config-expo`; invoked by `npm run lint` (`"lint": "expo lint"` in `package.json`).
  - `tsconfig.json` — strict mode, extends `expo/tsconfig.base`, path alias `@/*` → `src/*`; type-checked with `npx tsc --noEmit`.
  - `jest.config.js` — `jest-expo` preset with a `transformIgnorePatterns` list covering RN native modules and NativeWind; module alias `@/` mapped to `<rootDir>/src/`; invoked by `npm test`.
  - Husky pre-commit runs `eslint --fix` and `prettier --write` via `lint-staged` (scope: `**/*.{js,jsx,ts,tsx}`).
  - Three test files are present: `src/store/__tests__/useAuthStore.test.ts` (10 tests), `src/store/__tests__/useAppStore.test.ts` (19 tests), `src/hooks/__tests__/useProtectedRoute.test.ts` (11 tests).
  - oxlint is absent from `package.json` devDependencies.
- **User impact:** PRs to `master` will be gated by automated checks, enforcing code quality without relying solely on local pre-commit hooks.
- **Dependencies:**
  - GitHub Actions must be enabled on the repository (default for GitHub-hosted repos).
  - `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, and `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` must be added as GitHub Actions repository secrets. `lib/supabase.ts` calls `createClient(url, anonKey)` at module import time; even though unit tests mock network calls, the module still initializes and requires non-empty string values.
  - oxlint npm package must be added to `devDependencies`.
  - A `package-lock.json` must be committed (already present; `npm ci` requires it).

## Data Model

N/A — this feature adds CI infrastructure and a linting tool; no application data model is affected.

## Interfaces / API

### New npm script: `oxlint`

Added to the `scripts` section of `package.json`, adjacent to the existing `lint` entry:

```
"oxlint": "oxlint src/"
```

oxlint exits non-zero on any lint error. No `.oxlintrc.json` config file is introduced at this stage; the default rule set is sufficient.

### GitHub Actions workflow

**Trigger:** `pull_request` targeting `master` only.

**Job:** `ci`, runner `ubuntu-latest`, Node 20 LTS.

**Steps (in order):**

| Step       | Command                                                        |
| ---------- | -------------------------------------------------------------- |
| Checkout   | `actions/checkout@v4`                                          |
| Node setup | `actions/setup-node@v4` — `node-version: '20'`, `cache: 'npm'` |
| Install    | `npm ci`                                                       |
| ESLint     | `npm run lint`                                                 |
| oxlint     | `npm run oxlint`                                               |
| Type check | `npx tsc --noEmit`                                             |
| Unit tests | `npm test`                                                     |

**Environment variables** supplied at the job level via GitHub Actions secrets:

```yaml
env:
  EXPO_PUBLIC_SUPABASE_URL: ${{ secrets.EXPO_PUBLIC_SUPABASE_URL }}
  EXPO_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.EXPO_PUBLIC_SUPABASE_ANON_KEY }}
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: ${{ secrets.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID }}
```

## Files Created

| File                                   | Purpose                                                                                                   |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `.github/workflows/ci.yml`             | GitHub Actions workflow: installs deps, runs lint, oxlint, type check, and tests on every PR to `master`. |
| `docs/specs/github-actions-ci/SPEC.md` | This specification.                                                                                       |

## Files Modified

| File           | Change                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| `package.json` | Add `oxlint` to `devDependencies`; add `"oxlint": "oxlint src/"` to `scripts`. |

## Implementation Steps

1. Install oxlint: run `npm install --save-dev oxlint` and verify the installed version in `package.json`. Check https://www.npmjs.com/package/oxlint for the current stable release before running. Commit `package.json` and `package-lock.json` with message `chore: add oxlint`.

2. Add `"oxlint": "oxlint src/"` to the `scripts` block in `package.json`, directly after the `"lint"` entry. Verify locally: `npm run oxlint` must exit 0 on the current codebase with no pre-existing errors.

3. Create `.github/` and `.github/workflows/` directories. Create `.github/workflows/ci.yml` with the trigger, job, step, and environment variable structure described in the Interfaces / API section. Commit with message `feat: add github actions ci workflow`.

4. Add the three `EXPO_PUBLIC_*` secrets to the GitHub repository (Settings → Secrets and variables → Actions → New repository secret). Use the real values from the project `.env` file. This step must be completed by a maintainer before the workflow can pass the `npm test` step.

5. Open a PR from `feature/github-actions-ci` to `master` and confirm in the repository's Actions tab that the `CI` workflow appears, runs all five steps, and passes.

6. Validate failure behavior: introduce a deliberate ESLint error in a scratch branch, open a draft PR, confirm the lint step fails and blocks the workflow. Revert the scratch change.

## Style & Conventions

- Branch: `feature/github-actions-ci` (per CLAUDE.md `feature/` prefix convention).
- Commits follow Conventional Commits (`chore:` for tooling additions, `feat:` for the workflow file).
- `npm ci` is used in the workflow rather than `npm install` to guarantee reproducible installs from `package-lock.json`.
- Node 20 LTS is chosen for CI; it satisfies the `>= 18` requirement stated in CLAUDE.md and is a commonly available GitHub-hosted runner image.
- `ubuntu-latest` is the standard runner for Node/TypeScript CI; no platform-specific native build step runs here.
- `cache: 'npm'` in `setup-node` keys on `package-lock.json` and avoids redundant network downloads on unchanged dependencies.
- oxlint is additive: the existing `eslint.config.js` and `expo lint` command are not modified.

## Acceptance Criteria

- [ ] Opening or updating a PR targeting `master` triggers the `CI` workflow in the repository's Actions tab.
- [ ] The `CI` workflow passes end-to-end on a clean branch with no lint, type, or test errors.
- [ ] Introducing a deliberate ESLint error causes the `npm run lint` step to fail and the workflow to stop.
- [ ] Introducing a deliberate oxlint violation causes the `npm run oxlint` step to fail and the workflow to stop.
- [ ] Introducing a TypeScript type error causes the `npx tsc --noEmit` step to fail and the workflow to stop.
- [ ] Introducing a failing Jest assertion causes the `npm test` step to fail and the workflow to stop.
- [ ] `npm run oxlint` exits 0 locally against the current `src/` codebase before the PR is opened.
- [ ] `npx tsc --noEmit` exits 0 locally with no pre-existing errors introduced by this change.
- [ ] `npm test` exits 0 locally, passing all 40 existing tests (10 auth store + 19 app store + 11 route guard).
- [ ] No `.env`, `google-services.json`, `GoogleService-Info.plist`, or `credentials.json` values are hardcoded in the workflow file or any committed file.

## Constraints

- EAS Build (`eas build`) is explicitly out of scope and remains a manual step. The workflow does not trigger any native build.
- The workflow triggers only on `pull_request` events targeting `master`. Push events to feature branches do not trigger CI.
- No matrix strategy (multiple Node versions, OS variants) is in scope.
- oxlint replaces nothing: `eslint-config-expo` rules and the `expo lint` script remain unchanged.
- `google-services.json` is gitignored and absent from CI; no native Gradle or Xcode build runs, so the file is not needed.
- The three `EXPO_PUBLIC_*` secrets must be set by a maintainer with Supabase access before the `npm test` step can pass in CI. The spec does not prescribe using mock/placeholder values in the workflow file, as real values avoid masking initialization failures.
- Pre-existing ESLint or type errors in the codebase (if any) must be resolved before the workflow can pass; this spec does not scope that remediation work.
