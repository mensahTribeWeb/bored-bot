const { prepareDeployDirectory } = require('./preparation');
const { deployDirectoryToGithubPages } = require('./pages');

const DEPLOY_DIRECTORY = 'deploy-directory';

function deployToGithubPages(options) {
  prepareDeployDirectory(DEPLOY_DIRECTORY, options);

  return deployDirectoryToGithubPages(DEPLOY_DIRECTORY, options);
}

module.exports = { deployToGithubPages };
