const ghpages = require('gh-pages');

module.exports = { deployDirectoryToGithubPages };

async function deployDirectoryToGithubPages(directory, options) {
  try {
    await deploy(directory, options);
  } catch (err) {
    throw new Error(
      `Cannot deploy to GitHub pages:\n${err}${
        options.verbose ? `\nwith options:\n${JSON.stringify(options, undefined, 2)}` : ''
      }`,
    );
  }
}

function deploy(directory, { token, owner, repo, verbose, dotfiles }) {
  const params = {
    add: true,
    repo: `https://${token}@github.com/${owner}/${repo}.git`,
    silent: !verbose,
    dotfiles,
  };

  return new Promise((resolve, reject) => {
    ghpages.publish(directory, params, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
