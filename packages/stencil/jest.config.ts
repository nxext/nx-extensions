/* eslint-disable */
export default {
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html', 'json'],
  coverageDirectory: '../../coverage/packages/stencil',
  globals: {},
  displayName: 'stencil',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
