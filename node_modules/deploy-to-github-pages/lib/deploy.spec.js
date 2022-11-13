const { createOptions } = require('./options');
const {
  createPendingDeploymentStatus,
  updateDeploymentStatusToSuccessForId,
  updateDeploymentStatusToFailureForId,
} = require('./statuses');
const { deployToGithubPages } = require('./deployment');

const deploy = require('./');

jest.mock('./options');
jest.mock('./statuses');
jest.mock('./deployment');

describe('Deploy', () => {
  afterEach(jest.resetAllMocks);

  it('gets options', async () => {
    expect.assertions(2);

    expect(createOptions).not.toBeCalled();
    await deploy({ an: 'option' });
    expect(createOptions).toBeCalledWith({ an: 'option' });
  });

  it('creates pending deployment status with created options', async () => {
    expect.assertions(2);

    createOptions.mockImplementation(options => ({ ...options, another: 'option' }));

    expect(createPendingDeploymentStatus).not.toBeCalled();
    await deploy({ an: 'option' });
    expect(createPendingDeploymentStatus).toBeCalledWith({
      an: 'option',
      another: 'option',
    });
  });

  it('throws error with message if creating pending deployment status fails', async () => {
    expect.assertions(1);

    createPendingDeploymentStatus.mockImplementation(() => {
      throw new Error('An error');
    });

    try {
      await deploy({ an: 'option' });
    } catch (err) {
      expect(err.message).toContain('An error');
    }
  });

  it('deploys to gh-pages with created options', async () => {
    expect.assertions(2);

    createOptions.mockImplementation(options => ({ ...options, another: 'option' }));

    expect(deployToGithubPages).not.toBeCalled();
    await deploy({ an: 'option' });
    expect(deployToGithubPages).toBeCalledWith({
      an: 'option',
      another: 'option',
    });
  });

  it('updates deployment status to failure with status if deployment to gh-pages fails', async () => {
    expect.assertions(2);

    createOptions.mockImplementation(options => options);
    createPendingDeploymentStatus.mockResolvedValue(12345);
    deployToGithubPages.mockImplementation(() => {
      throw new Error();
    });

    expect(updateDeploymentStatusToFailureForId).not.toBeCalled();
    try {
      await deploy({ an: 'option' });
    } catch (err) {
      expect(updateDeploymentStatusToFailureForId).toBeCalledWith(12345, { an: 'option' });
    }
  });

  it('throws error with message if deployment to gh-pages fails', async () => {
    expect.assertions(1);

    createOptions.mockImplementation(options => options);
    deployToGithubPages.mockImplementation(() => {
      throw new Error('An error');
    });

    try {
      await deploy({ an: 'option' });
    } catch (err) {
      expect(err.message).toContain('An error');
    }
  });

  it('updates deployment status to success if everything succeeds', async () => {
    expect.assertions(2);

    createOptions.mockImplementation(options => options);
    createPendingDeploymentStatus.mockResolvedValue(98765);

    expect(updateDeploymentStatusToSuccessForId).not.toBeCalled();
    await deploy({ an: 'option' });
    expect(updateDeploymentStatusToSuccessForId).toBeCalledWith(98765, { an: 'option' });
  });
});
