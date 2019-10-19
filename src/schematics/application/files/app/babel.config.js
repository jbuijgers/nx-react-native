const path = require('path');

const libs = path.resolve(__dirname, '<%= offsetFromRoot %>libs');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '^@<%= workspaceName %>/(.+)': libs + '/\\1/src'
        }
      }
    ]
  ]
};
