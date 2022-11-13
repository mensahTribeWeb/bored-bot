const mockAuthenticate = jest.fn();
const mockCreateDeployment = jest.fn();
const mockCreateDeploymentStatus = jest.fn();
jest.mock('@octokit/rest', () => () => ({
  authenticate: mockAuthenticate,
  repos: {
    createDeployment: mockCreateDeployment,
    createDeploymentStatus: mockCreateDeploymentStatus,
  },
}));
const octokit = require('@octokit/rest')();

const { createDeployment, createDeploymentStatus } = require('./');

describe('Github', () => {
  afterEach(jest.resetAllMocks);

  it('authenticates when creating deployment', () => {
    expect(octokit.authenticate).not.toBeCalled();
    createDeployment({ token: 'a-token' });
    expect(octokit.authenticate).toBeCalledWith({ type: 'token', token: 'a-token' });
  });

  it('creates a deployment', () => {
    const options = { some: 'options', token: 'a-token' };

    expect(octokit.repos.createDeployment).not.toBeCalled();
    createDeployment(options);
    expect(octokit.repos.createDeployment).toBeCalledWith(options);
  });

  it('authenticates when creating deployment status', () => {
    expect(octokit.authenticate).not.toBeCalled();
    createDeploymentStatus({ token: 'a-token' });
    expect(octokit.authenticate).toBeCalledWith({ type: 'token', token: 'a-token' });
  });

  it('creates a deployment status', () => {
    const options = { some: 'options', token: 'a-token' };

    expect(octokit.repos.createDeploymentStatus).not.toBeCalled();
    createDeploymentStatus(options);
    expect(octokit.repos.createDeploymentStatus).toBeCalledWith(options);
  });
});
