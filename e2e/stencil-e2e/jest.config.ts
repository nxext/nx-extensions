export default {
  name: 'stencil-e2e',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e/stencil-e2e',
  maxWorkers: 1,
  preset: '../../jest.preset.js',
};
