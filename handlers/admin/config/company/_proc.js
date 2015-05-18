var fs = require('fs');
var path = require('path');
var jf = require('jsonfile');
var u = require('underscore');
var async = require("async");

function getCompanyNamesSync () {
    var directory = SERVICE.CONFIG_FILES_DIR,
        companyNames = [];

    fs.readdirSync(directory).forEach(function (filename) {
        var fullPath,
            stat,
            match;

        if (/^\./.test(filename)) {
            return;
        }
        fullPath = directory + '/' +  filename;
        stat = fs.statSync(fullPath);
        if (!stat.isDirectory()) {
            companyNames.push(filename.substring(0, filename.lastIndexOf('.')));
        }
    });
    return companyNames;
}

function getConfigByCompanyName (companyName, callback) {
    var configName;

    configName = getConfigName(companyName);
    jf.readFile(configName, function(error, configObj) {
        if(error){
            callback(error);
            return;
        }
        callback(null, configObj);
    });
}

function isExistConfig (companyName) {
    var companyNames;

    companyNames = getCompanyNamesSync();
    return u.contains(companyNames, companyName);
}

function getConfigName (companyName) {
    return path.join(SERVICE.CONFIG_FILES_DIR, "./" + companyName + ".json");
}

function delConfigByCompanyName (companyName, callback) {
    var error,
        configName;

    if(!isExistConfig(companyName)){
        error = new Error("the company is not exist.");
        error.statusCode = 400;
        callback(error);
        return;
    }

    configName = getConfigName(companyName);
    fs.unlink(configName, function (error) {
        if (error){
            callback(error);
            return;
        }
        callback(null);
    });
}

function updateConfigFile (companyName, configObj, callback) {
    var configName;

    configName = getConfigName(companyName);
    jf.spaces = 2;
    jf.writeFile(configName, configObj, function(error) {
        if(error){
            callback(error);
            return;
        }
        callback(null);
    });
}

function getPostData (req) {
    postData = {
        companyName: req.params.company,
        configObj: req.body.configObj
    };
    return postData;
}

function validatePostData (postData, callback){
    var error;

    if(!postData.companyName){
        error = new Error("company name is needed.");
        error.statusCode = 400;
        callback(error);
        return;
    }

    if(!postData.configObj){
        error = new Error("configObj is needed.");
        error.statusCode = 400;
        callback(error);
        return;
    }
    callback(null);
}

function list(req, res, next) {
    companyNames = getCompanyNamesSync();
    next({
        body: {
            companys: companyNames
        }
    });
}

function del(req, res, next) {
    var companyName;

    companyName = req.params.company;
    delConfigByCompanyName(companyName, function(error){
        if(error){
            next(error);
            return;
        }
        next({
            body: {
                success: true
            }
        });
    });
}

function post(req, res, next) {
    var postData,
        error;

    async.waterfall([

        function(callback){
            postData  = getPostData(req);
            validatePostData(postData, callback);
        },

        function(callback) {
            if(isExistConfig(postData.companyName)){
                error = new Error("duplicate company.");
                error.statusCode = 400;
                callback(error);
            }
            callback(null);
        },

        function(callback) {
            updateConfigFile(postData.companyName, postData.configObj, callback);
        }
    ],function(error, result){
        if(error) {
            next(error);
            return;
        }

        next({
            body: {
                success: true
            }
        });
    });
}

function put(req, res, next) {
    var postData,
        error;

    async.waterfall([

        function(callback){
            postData  = getPostData(req);
            validatePostData(postData, callback);
        },

        function(callback) {
            if(!isExistConfig(postData.companyName)) {
                error = new Error("the company is not exist.");
                error.statusCode = 400;
                callback(error);
            }
            callback(null);
        },

        function(callback) {
            updateConfigFile(postData.companyName, postData.configObj, callback);
        }
    ],function(error, result){
        if(error) {
            next(error);
            return;
        }

        next({
            body: {
                success: true
            }
        });
    });
}

function get(req, res, next) {
    var companyName;

    companyName = req.params.company;
    getConfigByCompanyName(companyName, function(error, configObj){
        if(error){
            next(error);
            return;
        }
        next({
            body: {
                config: configObj
            }
        });
    });
}

module.exports = {
    list: list,
    del: del,
    post: post,
    put: put,
    get: get
};






