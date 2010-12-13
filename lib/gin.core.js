(function(global, undefined) {
  global.gin = {
    version: '0.0.1',
    LOCAL_STORAGE_PREFIX: 'ginLiquorStore_'
  };
})(window);

gin.ns =  function(name, methods, container) {
  var ns = name.split('.'),
      o = container || window,
      i = 0, 
      ii = ns.length ;

  for(i; i < ii; i++){
    if(i === ii - 1) {
      o = o[ns[i]] = methods || {};
    } else {
      o = o[ns[i]] = o[ns[i]] || {};
    }
  }

  return o;
};

gin.Class = function() {
  return gin.oo.create.apply(this, arguments);
};

gin.oo = {
  create: function() {
    var methods = null,
        parent  = undefined,
        klass   = gin.ns(arguments[0], function() {
          this._super = function(method, args) {
            return gin.oo._super(this._parent, this, method, args);
          };
          this.init.apply(this, arguments);
        });

    if (typeof(arguments[1]) === 'function') {
      parent  = arguments[1];
      methods = arguments[2];
    } else {
      methods = arguments[1];
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

gin.events = {
  cache: {},

  publish: function(topic, args){
    if(!this.cache[topic]){return;}
    var i = 0,
        ii = this.cache[topic].length;
    for(i; i < ii; i++){
      var fn = this.cache[topic][i];
      fn.apply(fn, args || []);
    }
  },

  subscribe: function(topic, callback){
    if(!this.cache[topic]){this.cache[topic] = [];}
    this.cache[topic].push(callback);    
    return [topic, callback];
  },

  unsubscribe: function(handle){
    var t = handle;
    if(!this.cache[t]){return;}
    for(var id in this.cache[t]){
      if(id === handle[1]){
        this.cache[t].splice(id, 1);
      }
    }
  }
};

gin.db = {
  set: function(key, value){
    window.localStorage.setItem(gin.LOCAL_STORAGE_PREFIX + key, value)
  },

  get: function(key){
    return window.localStorage.getItem(gin.LOCAL_STORAGE_PREFIX + key);
  }
};



gin.utils = {
  isNumber: function(obj) {
    return (obj === +obj) || (toString.call(obj) === '[object Number]');
  },

  bind: function (scope, func) {
    var fn = typeof func == "string" ? scope[func] : func;
    return function () {
      return fn.apply(scope, arguments);
    };
  },

curry: function(){
    var scope = arguments[0];
    var func = arguments[1];
    var curried = Array.prototype.slice.call(arguments, 2);
    return function(){
      var f = yam.bind(scope, func);
      var args = curried.concat(Array.prototype.slice.call(arguments, 0));
      return f.apply(scope, args);
    }
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

  map: function(enumerable, callback, context) {
    if (Array.prototype.map && enumerable.map === Array.prototype.map) {
      return enumerable.map(callback, context);
    }
    var results = [];
    gin.enumerable.each(enumerable, function(value, index, list) {
      results.push(callback.call(context, value, index, list));
    });
    return results;
  },

  filter: function(enumerable, callback, context) {
    if (Array.prototype.filter && enumerable.filter === Array.prototype.filter) {
      return enumerable.filter(callback, context);
    }
    var results   = [],
        pushIndex = !gin.utils.isArray(enumerable);

    gin.enumerable.each(enumerable, function(value, index, list) {
      if (callback.call(context, value, index, list)) {
        if (pushIndex) {
          results.push(index, value);
        } else {
          results.push(value);
        }
      }
    });
    return results;
  },

  detect: function(enumerable, callback, context) {
    if (Array.prototype.detect && enumerable.detect === Array.prototype.detect) {
      return enumerable.detect(callback, context);
    }
    var result = [];
    gin.enumerable.each(enumerable, function(value, index, list){
      if (callback.call(context, value, index, list)) {
        result = value;
        throw gin.enumerable.Break;
      } 
    });
    return result;
  },

  chain: function(enumerable) {
    return new gin.enumerable.Chainer(enumerable);
  }
};

//Enumerable Aliases
gin.enumerable.select  = gin.enumerable.filter;
gin.enumerable.collect = gin.enumerable.map;
gin.chainableMethods   = ['select', 'collect', 'map', 'filter', 'detect'];

//Chainer constructor
gin.enumerable.Chainer = function(values) {
  this.results = values;
};

gin.enumerable.Chainer.prototype.values = function() {
  return this.results;
};

gin.enumerable.each(gin.chainableMethods, function(methodName) {
  var method = gin.enumerable[methodName];
  gin.enumerable.Chainer.prototype[methodName] = function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this.results);
    this.results = method.apply(this, args);
    return this;
  }
});

gin.ajax   = {/**stubbed namespace **/};
gin.dom    = {/**stubbed namespace **/};

//Core Aliases:
gin.bind  = gin.utils.bind;
gin.curry = gin.utils.curry;

