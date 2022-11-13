const shell = require('shelljs');

jest.mock('shelljs', () => ({
  set: jest.fn(),
  mkdir: jest.fn(),
  cp: jest.fn(),
  rm: jest.fn(),
  exec: jest.fn(),
}));
jest.mock('path', () => ({ join: (...parts) => parts.join('/') }));

const { prepareDeployDirectory } = require('.');

describe('Preparation', () => {
  afterEach(jest.resetAllMocks);

  describe('always', () => {
    it('sets shell to throw error when an operation fails', () => {
      expect(shell.set).toBeCalledWith('-e');
    });
  });

  describe('on master branch', () => {
    const options = { directory: 'source', branch: 'master', defaultBranch: 'master' };

    it('does not create branch directory', () => {
      expect(shell.mkdir).not.toBeCalled();
      prepareDeployDirectory('deploy-directory', options);
      expect(shell.mkdir).not.toBeCalled();
    });

    it('removes deploy directory to allow copying with replacement', () => {
      prepareDeployDirectory('deploy-directory', options);
      expect(shell.rm).toBeCalledWith('-rf', 'deploy-directory');
    });

    it('moves content from source directory to deploy directory', () => {
      expect(shell.cp).not.toBeCalled();
      prepareDeployDirectory('deploy-directory', options);
      expect(shell.cp).toBeCalledWith('-r', 'source', 'deploy-directory');
    });
  });

  describe('on a non-master branch', () => {
    const options = { directory: 'source', branch: 'not-master' };

    it('creates branch directory ', () => {
      expect(shell.mkdir).not.toBeCalled();
      prepareDeployDirectory('deploy-directory', options);
      expect(shell.mkdir).toBeCalledWith('-p', 'deploy-directory/branch');
    });

    it('removes current branch directory to allow copying with replacement', () => {
      expect(shell.rm).not.toBeCalled();
      prepareDeployDirectory('deploy-directory', options);
      expect(shell.rm).toBeCalledWith('-rf', 'deploy-directory/branch/not-master');
    });

    it('moves content from source directory to branch directory', () => {
      expect(shell.cp).not.toBeCalled();
      prepareDeployDirectory('deploy-directory', options);
      expect(shell.cp).toBeCalledWith('-r', 'source', 'deploy-directory/branch/not-master');
    });
  });
});
