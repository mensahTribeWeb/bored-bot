#! /usr/bin/env node
const program = require('commander');
const deploy = require('..');

const { version } = require('../package.json');

async function main() {
  program
    .version(version)
    .option('-d, --directory [directory]', 'Directory to be deployed')
    .option('-t, --token [token]', 'GitHub token')
    .option('-o, --owner [owner]', 'GitHub repo owner/org')
    .option('-r, --repo [repo]', 'GitHub repo name')
    .option('-b, --branch [branch]', 'Branch name')
    .option('-u, --build-url [build-url]', 'Link displayed when deployment fails')
    .option('-m, --defaultBranch [defaultBranch]', 'Specify the default branch for your repo')
    .option('--dotfiles', 'Include dotfiles')
    .option('--verbose', 'Log verbose information from gh-pages')
    .parse(process.argv);

  const options = cleanOptions({
    directory: program.directory,
    token: program.token,
    owner: program.owner,
    repo: program.repo,
    branch: program.branch,
    buildUrl: program.buildUrl,
    defaultBranch: program.defaultBranch,
    dotfiles: !!program.dotfiles,
    verbose: !!program.verbose,
  });

  try {
    await deploy(options);
  } catch (err) {
    console.log(err);

    process.exit(1);
  }
}

function cleanOptions(options) {
  return Object.keys(options).reduce((object, key) => {
    if (options[key]) {
      return { ...object, [key]: options[key] };
    }
    return object;
  }, {});
}

if (require.main === module) {
  main(process.argv);
}

module.exports = main;
