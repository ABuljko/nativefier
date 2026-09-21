# Contributing to Nativefier

## Issues

Please include the following in your new issue:

- Version of Nativefier (run `$ nativefier --version`)
- Version of Node.js (run `$ node --version`)
- Command line parameters
- OS and architecture you are running Nativefier from
- Stack trace from the error message (if any)
- Instructions to reproduce the issue

## Pull Requests

See [HACKING.md](https://github.com/ABuljko/nativefier/blob/main/HACKING.md) for
instructions on how to set up a development environment, and for the guidelines
we ask contributions to follow.

Code style is enforced by ESLint (with
[typescript-eslint](https://typescript-eslint.io/)) and
[Prettier](https://prettier.io/); please make sure tests and lints pass when you
submit your pull request.

The following commands might be helpful:

```bash
# Run tests only
npm test

# Run linter only
npm run lint

# Auto-fix lint errors and reformat
npm run lint:fix && npm run lint:format
```

Thank you so much for your contribution!
