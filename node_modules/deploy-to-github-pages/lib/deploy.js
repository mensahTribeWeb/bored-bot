const { createOptions } = require('./options');
const {
  createPendingDeploymentStatus,
  updateDeploymentStatusToSuccessForId,
  updateDeploymentStatusToFailureForId,
} = require('./statuses');
const { deployToGithubPages } = require('./deployment');

module.exports = deploy;

async function deploy(passedOptions = {}) {
  const options = createOptions(passedOptions);

  const id = await createPendingDeploymentStatus(options);

  try {
    await deployToGithubPages(options);
  } catch (err) {
    await updateDeploymentStatusToFailureForId(id, options);

    throw err;
  }

  return updateDeploymentStatusToSuccessForId(id, options);
}
