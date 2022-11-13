const ghpages = require('gh-pages');

const { deployDirectoryToGithubPages } = require('./');

jest.mock('gh-pages');

describe('Github pages', () => {
  it('deploys to gh-pages with correct options', async () => {
    expect.assertions(2);
    mockPublishForCallbackArgument(undefined);

    const options = {
      token: 'a-token',
      owner: 'an-owner',
      repo: 'a-repo',
      dotfiles: true,
      verbose: true,
    };
    expect(ghpages.publish).not.toBeCalled();
    await deployDirectoryToGithubPages('a-directory', options);
    expect(ghpages.publish).toBeCalledWith(
      'a-directory',
      {
        add: true,
        repo: 'https://a-token@github.com/an-owner/a-repo.git',
        silent: false,
        dotfiles: true,
      },
      expect.any(Function),
    );
  });

  it('throws if deployment to gh-pages fails', async () => {
    expect.assertions(1);
    mockPublishForCallbackArgument('An error');

    const directory = 'a-directory';
    try {
      await deployDirectoryToGithubPages(directory, {});
    } catch (err) {
      expect(err.message).toContain('An error');
    }
  });

  function mockPublishForCallbackArgument(argument) {
    ghpages.publish.mockImplementation((directory, options, callback) => {
      callback(argument);
    });
  }
});
