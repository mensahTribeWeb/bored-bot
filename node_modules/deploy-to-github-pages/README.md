# :rocket: deploy-to-github-pages

[![npm](https://img.shields.io/npm/v/deploy-to-github-pages.svg)](https://www.npmjs.com/package/deploy-to-github-pages)
[![GitHub release](https://img.shields.io/github/release/oliverviljamaa/deploy-to-github-pages.svg)](https://github.com/oliverviljamaa/deploy-to-github-pages/releases)
[![CircleCI](https://img.shields.io/circleci/project/github/oliverviljamaa/deploy-to-github-pages/master.svg)](https://circleci.com/gh/oliverviljamaa/deploy-to-github-pages)
[![npm](https://img.shields.io/npm/l/deploy-to-github-pages.svg)](https://github.com/oliverviljamaa/deploy-to-github-pages/blob/master/LICENSE)

A Node and CLI tool that makes deploying to GitHub pages **by branch** easy and automatic, best used as part of a CI process.

On `master` (or on your specified `defaultBranch` or `-m`) your directory will be deployed to your GitHub page root similarly to other libraries, such as the wonderful [`gh-pages`](https://www.npmjs.com/package/gh-pages).
On other branches, it'll be deployed under `/branch/${branchName}`, allowing your peers to QA your built docs/demos easily for better feedback.

It also sends a status to a Pull request, if one exists:

<img src="https://user-images.githubusercontent.com/5443561/37659087-e9f1cc14-2c46-11e8-82cf-1e76750d0e3f.gif" width="480">

## Installation

```bash
npm install -D deploy-to-github-pages
```

## Usage

### CLI

```bash
deploy-to-github-pages [...options]
```

### Node

```javascript
const deploy = require('deploy-to-github-pages');

deploy(options).catch(err => {
  console.log(err);
});
```

### Options

| Option          | flag | description                                        | default    | env variable   | required | required in CI |
| --------------- | ---: | -------------------------------------------------- | ---------- | -------------- | -------: | -------------: |
| `directory`     |   -d | directory you wish to deploy                       | `'public'` |                |       \* |             \* |
| `token`         |   -t | [GitHub token](https://github.com/settings/tokens) |            | `GITHUB_TOKEN` |       \* |             \* |
| `owner`         |   -o | GitHub repo owner/org                              |            |                |       \* |                |
| `repo`          |   -r | GitHub repo name                                   |            |                |       \* |                |
| `branch`        |   -b | branch name                                        | `'master'` |                |       \* |                |
| `buildUrl`      |   -u | link displayed when deployment fails               |            |                |          |                |
| `defaultBranch` |   -m | Your GitHub default branch                         | `'master'` |                |          |                |

Therefore, if ran from CircleCI or GitHub Actions workflows with a `GITHUB_TOKEN` environment variable present and the directory to be deployed is named `public`, _no configuration options are needed_, so just the following is enough:

```bash
deploy-to-github-pages
```

or

```javascript
deploy().catch(err => {
  console.log(err);
});
```

## Contributing

1. Run tests with `yarn test`.
1. Develop.
1. **Bump version number in `package.json` according to [semver](http://semver.org/) and add an item that a release will be based on to `CHANGELOG.md`**.
1. Submit your pull request from a feature branch and get code reviewed.
1. If the pull request is approved and the [CircleCI build](https://circleci.com/gh/oliverviljamaa/deploy-to-github-pages) passes, you will be able to squash and merge.
1. Code will automatically be released to [GitHub](https://github.com/oliverviljamaa/deploy-to-github-pages/releases) and published to [npm](https://www.npmjs.com/package/deploy-to-github-pages) according to the version specified in the changelog and `package.json`.

## Other

For features and bugs, feel free to [add issues](https://github.com/oliverviljamaa/deploy-to-github-pages/issues) or contribute.
