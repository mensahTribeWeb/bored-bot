# v1.0.1
## Update gh-pages to version 3

# v1.0.0
## Release version 1

- contains all changes from `v1.0.0-beta.*` releases

# v1.0.0-beta.7
## Add -m flag

- fix typo for `--defaulBranch`
- when the `--defaultBranch` or `m` flag is passed, users can specify a different default branch other than master

# v1.0.0-beta.6
## Add --defaultBranch flag

- when the `--defaultBranch` flag is passed, users can specify a different default branch other than master

# v1.0.0-beta.5
## Log options when verbose

- when the `--verbose` flag is passed, `options` will be logged as well on deployment failure

# v1.0.0-beta.4
## Add --verbose flag

- `--verbose` flag defaulting to `false` is added, which when set, configures `gh-pages` [`silent` property](https://www.npmjs.com/package/gh-pages#optionssilent) as `false`, logging more information.

# v1.0.0-beta.3
## Get options from GitHub Actions environments

Only `directory` and `token` options are now required when running in [GitHub Actions](https://help.github.com/en/actions) workflows, similarly to CircleCI.

# v1.0.0-beta.2
## Support --dotfiles

- `--dotfiles` flag defaulting to `false` is now supported, similarly to [gh-pages](https://www.npmjs.com/package/gh-pages#optionsdotfiles), to support deploying pages which need dotfiles to function correctly

# v1.0.0-beta.1
## Deploy to root on `master` branch

- when branch is `master`, the directory won't be deployed to `/branch/${branchName}`, but `/` instead, allowing consumers to only rely on this package and not need `gh-pages` in addition
- default `branch` value of `master` is added

# v0.2.8
## Fix deployment id error

- deployment id was taken from the wrong field

# v0.2.7
## Refactors

- error on pulling gh-pages branch to directory is logged now

# v0.2.6
## Use Object spread instead of Object.assign

There is no change in library behaviour.

# v0.2.5
## Updates dependencies

# v0.2.4
## Adds index.html to deployment URL

GitHub pages, if not root, do not automatically redirect to `index.html`.

# v0.2.3
## Adds trailing slash to deployment URL

GitHub pages sometimes had inconsistent behaviour without it.

# v0.2.2
## Uses passed token to publish to gh-pages

# v0.2.1
## Fixes CLI

Command Line Interface directory (`bin/`) is now included in the published npm package.

# v0.2.0
## Adds Command Line Interface

The main functionality is now exposed as `deploy-directory-on-branch-to-gh-pages` command.

# v0.1.0
## Initial release

This release exposes the main functionality as the default `deploy` function.
