module.exports = {
    
    GET : [{
        path : '/{{api}}',
        action : 'GET',
        // policy : 'authenticated'
    },{
        path : '/{{api}}/:id',
        action : 'findOne',
        // policy : 'authenticated'
    },{
        path : '/{{api}}/:id/*',
        action : 'scaffold',
        // policy : 'authenticated'
    }],
    
    POST : [{
        path : '/{{api}}',
        action : 'POST',
        // policy : 'authenticated'
    }],
    
    PUT : [{
        path : '/{{api}}/:id',
        action : 'PUT',
        // policy : 'authenticated'
    }],

    DELETE : [{
        path : '/{{api}}/:id',
        action : 'DELETE',
        // policy : 'authenticated'
    }]
}