var object = {

    extend : function (source, modifications) {
             
            var extended, 
                newKeys = Object.keys(modifications);
          
            extended = Object.keys(source).length ? object.clone(source) : {};
          
            newKeys.forEach(function(key) {
                Object.defineProperty(extended, key, Object.getOwnPropertyDescriptor(modifications, key));
            });
          
            return extended;
        }
    },
    
    clone : function (obj) {
        return object.extend({}, obj);
    }
};

module.exports = object;