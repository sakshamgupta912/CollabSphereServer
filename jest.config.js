const path = require('path');

module.exports = {
  transformIgnorePatterns: [path.join(__dirname, 'node_modules')],
  testEnvironment: 'node',
};