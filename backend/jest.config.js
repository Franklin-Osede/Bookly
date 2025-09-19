module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testRegex: 'test/.*\\.spec\\.ts$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(uuid)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
  ],
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@/hotel/(.*)$': '<rootDir>/src/hotel/$1',
    '^@/restaurant/(.*)$': '<rootDir>/src/restaurant/$1',
    '^@/ai/(.*)$': '<rootDir>/src/ai/$1',
    '^@/admin/(.*)$': '<rootDir>/src/admin/$1',
  },
};
