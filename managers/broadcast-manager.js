var io = null;
var logger = null;

exports.notifyConfigChanged = function (options) {
    var eventData = {
            companyCode: options.companyCode,
            sectionName: options.sectionName
        };
    logger.trace('emitting `configChanged` event to all clients. ', eventData);
    io.emit('configChanged', eventData);
};

exports.bindSocketIO = function (socketIO, argLogger) {
    io = socketIO;
    logger = argLogger;

    io.on('connection', function () {
        logger.trace('client connected to server.');
    });
};