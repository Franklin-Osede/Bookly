module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/shared/(.*)$': '<rootDir>/shared/$1',
    '^@/hotel/(.*)$': '<rootDir>/hotel/$1',
    '^@/restaurant/(.*)$': '<rootDir>/restaurant/$1',
    '^@/ai/(.*)$': '<rootDir>/ai/$1',
    '^@/admin/(.*)$': '<rootDir>/admin/$1',
  },
};
