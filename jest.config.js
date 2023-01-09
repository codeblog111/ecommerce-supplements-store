const config = {
  verbose: true,
  testPathIgnorePatterns: ['/frontend/', '/cypress/'],
  moduleDirectories: ['node_modules'],
  modulePathIgnorePatterns: ['<rootDir>/frontend'],
  testEnvironment: 'node',
  testMatch: ['**/*test*'],
};

module.exports = config;
