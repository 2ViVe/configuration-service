var ConfigurationManager = require('../managers/configuration-manager');
var router = require('nodejs-lighter').Router();

router.get('/:sectionName', function (req, res, next) {
    var context = req.context,
        sectionName = req.params.sectionName;

    ConfigurationManager.getSectionValueAsync(context, sectionName).then(function (value) {
            next({body: value});
        }).catch(function (error) {
            next(error);
        });
});

module.exports = router;