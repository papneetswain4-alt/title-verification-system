module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  moduleNameMapper: {
    '^uuid$': '<rootDir>/tests/mocks/uuidMock.js',
    '^afinn-165$': '<rootDir>/tests/mocks/afinnMock.js'
  }
};
