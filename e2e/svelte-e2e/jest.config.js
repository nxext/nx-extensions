module.exports = {
  name: 'svelte-e2e',
  preset: '../../jest.preset.js',
  testTimeout: 300000,
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e/svelte-e2e',
  runner: '../serial-jest-runner.js'
};
