export default {
  displayName: 'stencil-e2e',

  globals: {},
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e/stencil-e2e',
  preset: '../../jest.preset.js',
  maxWorkers: 1,
};
