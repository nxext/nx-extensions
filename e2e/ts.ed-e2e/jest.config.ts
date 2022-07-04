export default {
  displayName: 'ts.ed-e2e',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e/ts.ed-e2e',
  preset: '../../jest.preset.js',
  maxWorkers: 1,
};
