var gin = {
  ns: function() {
    var ns = name.split('.'),
        o = container || window,
        i = 0, 
        ii = ns.length ;

    for(i; i < ii; i++){
      if(i === ii - 1) {
        o = o[ns[i]] = definition || {};
      } else {
        o = o[ns[i]] = o[ns[i]] || {};
      }
    }

    return o;
  }
};

gin.Class = function() {
  return gin.oo.create.apply(this, arguments);
};

gin.oo = {
  create: function() {
    var methods = null,
        parent  = undefined,
        klass   = function() {
          this._super = function(method, args) {
            return gin.oo._super(this._parent, this, method, args);
          };
          this.init.apply(this, arguments);
        };

    if (typeof(arguments[0]) === 'function') {
      parent  = arguments[0];
      methods = arguments[1];
    } else {
      methods = arguments[0];
    }

    if (typeof(parent) !== 'undefined') {
      gin.oo.extend(klass.prototype, parent.prototype);
      klass.prototype._parent = parent.prototype;
    }

    gin.oo.mixin(klass, methods);
    gin.oo.extend(klass.prototype, methods);
    klass.prototype.constructor = klass;

    if (!klass.prototype.init) {
      klass.prototype.init = function(){};
    }
    return klass;
  },

  mixin: function(klass, methods) {
    if (typeof(methods.include) !== 'undefined') {
      if (typeof methods.include === 'function') {
        gin.oo.extend(klass.prototype, methods.include.prototype);
      } else {
        for (var i = 0, ii = methods.include.length; i < ii; i++) {
          gin.oo.extend(klass.prototype, methods.include[i].prototype);
        }
      }
    }
  },

  extend: function(destination, source) {
    for (var property in source) {
      destination[property] = source[property];
    }
    return destination;
  },

  _super: function(parentClass, instance, method, args) {
    if (typeof(parentClass[method]) === 'function') {
      return parentClass[method].apply(instance, args);
    } else {
      return parentClass[method];
    }
  }
};

gin.utils = {
  isNumber: function(obj) {
    return (obj === +obj) || (toString.call(obj) === '[object Number]');
  }
};

gin.enumerable = {
  Break: {},

  each: function(enumerable, callback, context) {
    try {
      if (Array.prototype.forEach && enumerable.forEach === Array.prototype.forEach) {
        enumerable.forEach(callback, context);
      } else if (gin.utils.isNumber(enumerable.length)) {
        for (var i = 0, ii = enumerable.length; i < ii; i++) {
          callback.call(enumerable, enumerable[i], i, enumerable);
        }
      } else {
        for (var key in enumerable) {
          if (hasOwnProperty.call(enumerable, key)) {
            callback.call(context, enumerable[key], key, enumerable);
          }
        }
      }
    } catch(e) {
      if (e != gin.enumerable.Break) {throw e};
    }
  },

  map: function() {
       
  },

  filter: function() {
          
  }


};
