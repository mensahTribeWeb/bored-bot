const { createDeployment, createDeploymentStatus } = require('./github');
const {
  createPendingDeploymentStatus,
  updateDeploymentStatusToSuccessForId,
  updateDeploymentStatusToFailureForId,
} = require('./');

jest.mock('./github');

describe('Statuses', () => {
  afterEach(jest.resetAllMocks);

  it('creates pending deployment status with token, owner, repo and branch from options', async () => {
    expect.assertions(2);
    createDeployment.mockReturnValue({ data: {} });

    const options = {
      token: 'a-token',
      owner: 'an-owner',
      repo: 'a-repo',
      branch: 'a-branch',
      buildUrl: '/a-build-url',
    };

    expect(createDeployment).not.toBeCalled();
    await createPendingDeploymentStatus(options);
    expect(createDeployment).toBeCalledWith(
      expect.objectContaining({
        token: 'a-token',
        owner: 'an-owner',
        repo: 'a-repo',
        ref: 'a-branch',
      }),
    );
  });

  it('returns status id from creating pending deployment status', async () => {
    expect.assertions(1);

    createDeployment.mockResolvedValue({ data: { id: 12345 } });

    const options = {
      token: 'a-token',
      owner: 'an-owner',
      repo: 'a-repo',
      branch: 'a-branch',
      buildUrl: '/a-build-url',
    };

    const id = await createPendingDeploymentStatus(options);
    expect(id).toBe(12345);
  });

  it('throws with error message if creating deployment status fails', async () => {
    expect.assertions(1);

    createDeployment.mockImplementation(() => {
      throw new Error('An error');
    });

    const options = {
      token: 'a-token',
      owner: 'an-owner',
      repo: 'a-repo',
      branch: 'a-branch',
      buildUrl: '/a-build-url',
    };

    try {
      await createPendingDeploymentStatus(options);
    } catch (err) {
      expect(err.message).toContain('An error');
    }
  });

  it('updates deployment status to success with token, owner and repo from options', async () => {
    expect.assertions(2);

    const options = {
      token: 'a-token',
      owner: 'an-owner',
      repo: 'a-repo',
      branch: 'a-branch',
      buildUrl: '/a-build-url',
    };

    expect(createDeploymentStatus).not.toBeCalled();
    await updateDeploymentStatusToSuccessForId(98765, options);
    expect(createDeploymentStatus).toBeCalledWith({
      token: 'a-token',
      deployment_id: 98765,
      state: 'success',
      owner: 'an-owner',
      repo: 'a-repo',
      log_url: undefined,
      environment_url: 'https://an-owner.github.io/a-repo/branch/a-branch/index.html',
    });
  });

  it('throws with error message if updating deployment status to success fails', async () => {
    expect.assertions(1);

    createDeploymentStatus.mockImplementation(() => {
      throw new Error('An error');
    });

    const options = {
      token: 'a-token',
      owner: 'an-owner',
      repo: 'a-repo',
      branch: 'a-branch',
      buildUrl: '/a-build-url',
    };

    try {
      await updateDeploymentStatusToSuccessForId(98765, options);
    } catch (err) {
      expect(err.message).toContain('An error');
    }
  });

  it('updates deployment status to failure with token, owner, repo and build url from options', async () => {
    expect.assertions(2);

    const options = {
      token: 'a-token',
      owner: 'an-owner',
      repo: 'a-repo',
      branch: 'a-branch',
      buildUrl: '/a-build-url',
    };

    expect(createDeploymentStatus).not.toBeCalled();
    await updateDeploymentStatusToFailureForId(34567, options);
    expect(createDeploymentStatus).toBeCalledWith({
      token: 'a-token',
      deployment_id: 34567,
      state: 'failure',
      owner: 'an-owner',
      repo: 'a-repo',
      log_url: '/a-build-url',
      environment_url: 'https://an-owner.github.io/a-repo/branch/a-branch/index.html',
    });
  });

  it('throws with error message if updating deployment status to failure fails', async () => {
    expect.assertions(1);

    createDeploymentStatus.mockImplementation(() => {
      throw new Error('An error');
    });

    const options = {
      token: 'a-token',
      owner: 'an-owner',
      repo: 'a-repo',
      branch: 'a-branch',
      buildUrl: '/a-build-url',
    };

    try {
      await updateDeploymentStatusToFailureForId(34567, options);
    } catch (err) {
      expect(err.message).toContain('An error');
    }
  });
});
