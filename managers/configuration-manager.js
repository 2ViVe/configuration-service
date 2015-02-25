var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var BroadcastManager = require('./broadcast-manager');

var configMapByCompanyCode = {};

var configFilesDir = path.join(__dirname, '../config-files');
fs.watch(configFilesDir, function (event, fileName) {
    var regJSON = /(\w+).json$/i,
        matchJSON = regJSON.exec(fileName),
        companyCode;

    if (!matchJSON) {
        return;
    }

    companyCode = matchJSON[1];
    if (!configMapByCompanyCode[companyCode]) {
        return;
    }

    configFileName = path.join(configFilesDir, companyCode + '.json');
    console.trace("Reload config from file '%s'", configFileName);
    loadConfigFromFileAsync(configFileName).then(function (config) {
        configMapByCompanyCode[companyCode] = config;

        BroadcastManager.notifyConfigChanged({
            companyCode: companyCode
        });
    });
});

function loadConfigFromFileAsync(configFileName) {
    return new Promise(function (resolve, reject) {
        try {
            var config = JSON.parse(fs.readFileSync(configFileName));
            resolve(config);
        } catch (ex) {
            reject(ex);
        }
    });
}

exports.getSectionValueAsync = function (context, sectionName) {
    var logger = context.logger;

    return new Promise(function (resolve, reject) {
        var companyCode = context.companyCode,
            configFileName,
            configValue;

        logger.trace("Getting config value. company: %s, section: %s", companyCode, sectionName);

        if (configMapByCompanyCode[companyCode]) {
            configValue = configMapByCompanyCode[companyCode][sectionName];
            if (configValue) {
                logger.trace("Config value found in cache.");
            } else {
                logger.trace("Config value was not set.");
            }
            resolve(configValue);
            return;
        }

        configFileName = path.join(configFilesDir, companyCode + '.json');
        logger.trace("Loading config from file '%s'", configFileName);
        loadConfigFromFileAsync(configFileName).then(function (config) {
            if (!config) {
                logger.trace("Config file empty.");
                resolve(null);
            } else {
                configMapByCompanyCode[companyCode] = config;
                configValue = config[sectionName];
                if (configValue) {
                    logger.trace("Config value found in file.");
                } else {
                    logger.trace("Config value was not set.");
                }
                resolve(configValue);
            }
        });
    });
};