const { createDeployment, createDeploymentStatus } = require('./github');

const DEPLOYMENT_STATUSES = { SUCCESS: 'success', FAILURE: 'failure' };

module.exports = {
  createPendingDeploymentStatus,
  updateDeploymentStatusToSuccessForId,
  updateDeploymentStatusToFailureForId,
};

async function createPendingDeploymentStatus({ token, owner, repo, branch }) {
  try {
    const options = {
      token,
      owner,
      repo,
      ref: branch,
      environment: 'gh-pages',
      auto_merge: false,
      transient_environment: true,
      required_contexts: [],
    };
    const response = await createDeployment(options);

    return response.data.id;
  } catch (err) {
    throw new Error(`Cannot create deployment status: ${err}`);
  }
}

function updateDeploymentStatusToSuccessForId(id, options) {
  return updateDeploymentStatusForId(id, DEPLOYMENT_STATUSES.SUCCESS, options);
}

function updateDeploymentStatusToFailureForId(id, options) {
  return updateDeploymentStatusForId(id, DEPLOYMENT_STATUSES.FAILURE, options);
}

async function updateDeploymentStatusForId(id, status, { token, owner, repo, branch, buildUrl }) {
  const deploymentUrl = `https://${owner}.github.io/${repo}/branch/${branch}/index.html`;

  try {
    const options = {
      token,
      owner,
      repo,
      deployment_id: id,
      state: status,
      log_url: status === DEPLOYMENT_STATUSES.FAILURE ? buildUrl : undefined,
      environment_url: deploymentUrl,
    };
    await createDeploymentStatus(options);
  } catch (err) {
    throw new Error(`Cannot update deployment status: ${err}`);
  }
}
