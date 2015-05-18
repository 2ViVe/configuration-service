var ConfigurationManager = require('../managers/configuration-manager');

function registRouters(lighter, middleware, handler) {

    lighter.get('/v1/sections/:sectionName', function (req, res, next) {
        var context = req.context,
            sectionName = req.params.sectionName;
        console.log(sectionName);

        ConfigurationManager.getSectionValueAsync(context, sectionName).then(function (value) {
                next({body: value});
            }).catch(function (error) {
                next(error);
            });
    });

}

module.exports = registRouters;