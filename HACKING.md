# Development Guide

## Guidelines

1. **Open an issue before starting a big change**, to agree on the approach first.
2. **Avoid adding command-line options.** Nativefier already has a ton of them,
   making it hard to use.
3. **Limit breaking changes.** To replace a flag, keep honoring the old one and
   map it onto the new one. See [Rich Hickey - Spec-ulation](https://www.youtube.com/watch?v=oyLBGkS5ICk).
4. **Avoid adding npm dependencies.** Each one is a complexity & security liability;
   for a mundane task, prefer a small in-tree helper.
5. Use **types**, avoid `any`, write **tests**.
6. **Document for users** in `API.md`.
7. **Document for other devs** in comments, jsdoc, commits, PRs.
   Say _why_ more than _what_, the _what_ is your code!

## Setup

You need Node.js ≥ 22.12.0 and npm ≥ 10.9.0 (see `package.json` / `engines`).
The `.nvmrc` pins the Node major we build & test against, so `nvm use` works.

First, clone the project:

```bash
git clone https://github.com/ABuljko/nativefier.git
cd nativefier
```

Install dependencies (for both the CLI and the Electron app):

```bash
npm ci
```

The above `npm ci` will build automatically (through the `prepare` hook).
When you need to re-build Nativefier,

```bash
npm run build
```

Set up a symbolic link so that running `nativefier` calls your dev version with your changes:

```bash
npm link
which nativefier
# -> Should return a path, e.g. /home/youruser/.node_modules/lib/node_modules/nativefier
# If not, be sure your `npm_config_prefix` env var is set and in your `PATH`
```

After doing so, you can run Nativefier with your test parameters:

```bash
nativefier --your-awesome-new-flag 'https://your-test-site.com'
```

Then run your nativefier app _through the command line too_ (to see logs & errors):

```bash
# Under Linux
./your-test-site-linux-x64/your-test-site

# Under Windows
your-test-site-win32-x64/your-test-site.exe

# Under macOS
./YourTestSite-darwin-x64/YourTestSite.app/Contents/MacOS/YourTestSite --verbose
```

## Linting & formatting

Code is formatted with [Prettier](https://prettier.io/): install its
[editor plugin](https://prettier.io/docs/en/editors.html), or run `npm run lint:format`.

## Tests

- To run all tests, `npm t`
- To run only unit tests, `npm run test:unit`
- To run only integration tests, `npm run test:integration`
- To run only the Playwright end-to-end tests, `npm run test:playwright` (Windows-only in CI)
- To run everything except Playwright, `npm run test:noplaywright`
- Logging is suppressed by default in tests, to avoid polluting Jest output.
  To get debug logs, `npm run test:withlog` or set the `LOGLEVEL` env. var.
- To re-run tests on every change, run `npm run build:watch` and `npm run test:watch`
  in two terminals, or both in one with `npm run watch`

## Maintainers corner

### Deps: major-upgrading Electron

When a new major [Electron release](https://github.com/electron/electron/releases) occurs,

1. Wait a few weeks to let it stabilize. Never upgrade Nativefier to a `.0.0`.
2. Read its [breaking changes](https://www.electronjs.org/docs/breaking-changes),
   [release notes](https://github.com/electron/electron/releases) and [blog post](https://www.electronjs.org/blog/)
   (they differ), and adapt our code to every changed API it uses.
3. Bump
   - `src/constants.ts` / `DEFAULT_ELECTRON_VERSION` & `DEFAULT_CHROME_VERSION`
   - `package.json / devDeps / electron`
   - `app / package.json / devDeps / electron`
4. On Windows, macOS, Linux, test for regression and crashes:
   1. With `npm test` and `npm run test:manual`
   2. With extra manual testing
5. When confident enough, release it in a regression-spelunking-friendly way:
   1. If `main` has unreleased commits, make a patch/minor release with them, but without the major Electron bump.
   2. Commit your Electron major bump and release it as a major new Nativefier version. Help users identify the breaking change by using a bold **[BREAKING]** marker in `CHANGELOG.md` and in the GitHub release.

### Deps updates

Upgrade CLI & App deps regularly, one major version at a time: the further
behind a dep falls, the riskier its upgrade, and old majors rarely get security
fixes. `npm run list-outdated-deps` lists them, and the release script shows them too.

### Deps lockfile / shrinkwrap

Both `npm-shrinkwrap.json` & `app/npm-shrinkwrap.json` are committed, for security,
reproducibility and performance. After changing a dependency, `npm run relock`
regenerates them. They are shrinkwrap files rather than `package-lock.json`
because, [unlike it](https://docs.npmjs.com/cli/v6/configuring-npm/shrinkwrap-json),
shrinkwrap also applies to people installing Nativefier.

### Release

While on `main`, with no uncommitted changes, run:

```bash
npm run changelog -- $VERSION
# With no 'v'. For example: npm run changelog -- '42.5.0'
```

It bumps the version, adds the commits since the last release to `CHANGELOG.md`
and opens it in your editor for cleanup, then commits and tags. Push, then
create the GitHub release from the new tag, as the script reminds you.
Nothing is published to npm or Docker Hub.

Do follow semantic versioning, and give visibility to breaking changes
in release notes by prefixing their line with **[BREAKING]**.
