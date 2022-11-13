const octokit = require('@octokit/rest')();

module.exports = { createDeployment, createDeploymentStatus };

function createDeployment(options) {
  return withAuthentication(options)(octokit.repos.createDeployment);
}

function createDeploymentStatus(options) {
  return withAuthentication(options)(octokit.repos.createDeploymentStatus);
}

function withAuthentication(options) {
  return fn => {
    authenticate(options);
    return fn(options);
  };
}

function authenticate({ token }) {
  octokit.authenticate({ type: 'token', token });
}
