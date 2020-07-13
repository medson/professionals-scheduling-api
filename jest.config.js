module.exports = {
  // Stop running tests after `n` failures
  bail: 0,

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['**/*.{js,jsx}', '!**/node_modules/**'],

  // The directory where Jest should output its coverage files
  coverageDirectory: './src/__tests__/',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'lcov-report',
    'jest.config.js',
    'src/index.js'
  ],

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.spec.js?(x)']
}
