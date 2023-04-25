/* eslint-disable */
export default {
  displayName: 'sveltekit',

  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/sveltekit',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
