const shell = require('shelljs');
const path = require('path');

const BRANCH_DIRECTORY_NAME = 'branch';

shell.set('-e');

module.exports = { prepareDeployDirectory };

function prepareDeployDirectory(
  deployDirectory,
  { directory: sourceDirectory, branch, defaultBranch },
) {
  createBranchDirectoryIfNeeded(deployDirectory, branch, defaultBranch);

  copyContentWithReplacement(
    sourceDirectory,
    getTargetDirectory(deployDirectory, branch, defaultBranch),
  );
}

function createBranchDirectoryIfNeeded(deployDirectory, branch, defaultBranch) {
  if (branch !== defaultBranch) {
    shell.mkdir('-p', getBranchDirectory(deployDirectory));
  }
}

function getBranchDirectory(deployDirectory) {
  return path.join(deployDirectory, BRANCH_DIRECTORY_NAME);
}

function getTargetDirectory(deployDirectory, branch, defaultBranch) {
  return branch === defaultBranch
    ? deployDirectory
    : path.join(getBranchDirectory(deployDirectory), branch);
}

function copyContentWithReplacement(source, target) {
  shell.rm('-rf', target);
  shell.cp('-r', source, target);
}
