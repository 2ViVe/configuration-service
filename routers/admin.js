
function registRouters(lighter, middleware, handler) {

    lighter.get('/v1/admin/config',
        handler.admin.config.company.list
    );

    lighter.get('/v1/admin/config/:company',
        handler.admin.config.company.get
    );

    lighter.post('/v1/admin/config/:company',
        handler.admin.config.company.post
    );

    lighter.put('/v1/admin/config/:company',
        handler.admin.config.company.put
    );

    lighter.delete('/v1/admin/config/:company',
        handler.admin.config.company.del
    );

}

module.exports = registRouters;