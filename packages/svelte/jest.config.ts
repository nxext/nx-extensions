/* eslint-disable */
export default {
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/svelte',
  displayName: 'svelte',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
