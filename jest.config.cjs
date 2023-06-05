module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  modulePathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
  ],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  roots: ['<rootDir>'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/$1',
    '@dex/(.*)': '<rootDir>/src/dex/$1',
    '@providers/(.*)': '<rootDir>/src/providers/$1',
    '@requests/(.*)': '<rootDir>/src/requests/$1',
  }
};