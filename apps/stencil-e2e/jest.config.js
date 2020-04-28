module.exports = {
  name: 'stencil-e2e',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/stencil-e2e',
  testTimeout: 300000,
  runner: './serial-jest-runner.js',
};
