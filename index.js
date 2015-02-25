var Lighter = require('nodejs-lighter');
var config = require('./config.sample.json');

var lighter = new Lighter(config);
var logger = lighter.logger;
var middlewares = lighter.middlewares;

lighter.use(middlewares.contextCreator());
lighter.use(middlewares.logger(logger));

lighter.get('/status', function (req, res, next) {
    req.context.logger.info('getting /status');
    next({
        body: {ok: true}
    });
});

lighter.use('/sections', require('./routers/section'));

lighter.use(middlewares.responder);

// set up socket.io
var io = require('socket.io')(lighter.server);
require('./managers/broadcast-manager').bindSocketIO(io, logger);

lighter.run();
