module.exports = {
    
    GET : [{
        path : '/{{model}}',
        action : 'GET',
        policy : 'authenticated'
    },{
        path : '/{{model}}/:id',
        action : 'findOne',
        policy : 'authenticated'
    },{
        path : '/{{model}}/:id/*',
        action : 'scaffold',
        policy : 'authenticated'
    }],
    
    POST : [{
        path : '/{{model}}',
        action : 'POST',
        policy : 'authenticated'
    }],
    
    PUT : [{
        path : '/{{model}}/:id',
        action : 'PUT',
        policy : 'authenticated'
    }],

    DELETE : [{
        path : '/{{model}}/:id',
        action : 'DELETE',
        policy : 'authenticated'
    }],

    IO : [{
        path : '/{{model}}/:id',
        action : 'realTimeUpdate',
        policy : 'authenticated'
    }]
}