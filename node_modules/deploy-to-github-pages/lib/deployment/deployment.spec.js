const { prepareDeployDirectory } = require('./preparation');
const { deployDirectoryToGithubPages } = require('./pages');
const { deployToGithubPages } = require('./');

jest.mock('./preparation');
jest.mock('./pages');

describe('Deployment', () => {
  afterEach(jest.resetAllMocks);

  it('prepares directory to be deployed', () => {
    expect(prepareDeployDirectory).not.toBeCalled();
    deployToGithubPages({ some: 'options' });
    expect(prepareDeployDirectory).toBeCalledWith('deploy-directory', { some: 'options' });
  });

  it('deploys directory to gh-pages', () => {
    expect(deployDirectoryToGithubPages).not.toBeCalled();
    deployToGithubPages({ some: 'options' });
    expect(deployDirectoryToGithubPages).toBeCalledWith('deploy-directory', { some: 'options' });
  });
});
