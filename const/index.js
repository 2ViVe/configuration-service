var path = require('path'),
    configFilesDir;

configFilesDir = path.join(__dirname, "../config-files");

global.SERVICE = {
    CONFIG_FILES_DIR: configFilesDir
};