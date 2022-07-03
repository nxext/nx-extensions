const nxPreset = require('@nrwl/jest/preset').default;
module.exports = {
  ...nxPreset,
  testTimeout: 50000,
};
