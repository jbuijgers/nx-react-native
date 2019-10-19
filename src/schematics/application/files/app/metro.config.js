const path = require('path');

module.exports = {
  watchFolders: [
    path.resolve(__dirname, '<%= offsetFromRoot %>node_modules'),
    path.resolve(__dirname, '<%= offsetFromRoot %>libs')
  ],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    })
  }
};
