(function(global, undefined) {
  global.gin = {
    version: '0.0.1',
    LOCAL_STORAGE_PREFIX: 'ginLiquorStore_',

    ns:  function(name, methods, container) {
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
    },

    Class: function() {
      return gin.oo.create.apply(this, arguments);
    },

    oo: {
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
    },

    events: {
      cache: {},

      publish: function(topic, args){
        if(!gin.events.cache[topic]){return;}
        var i = 0,
            ii = gin.events.cache[topic].length;
        for(i; i < ii; i++){
          var fn = gin.events.cache[topic][i];
          fn.apply(fn, args || []);
        }
      },

      subscribe: function(topic, callback){
        if(!gin.events.cache[topic]){gin.events.cache[topic] = [];}
        gin.events.cache[topic].push(callback);    
        return [topic, callback];
      },

      unsubscribe: function(handle){
        var t = handle;
        if(!gin.events.cache[t]){return;}
        for(var id in gin.events.cache[t]){
          if(id === handle[1]){
            gin.events.cache[t].splice(id, 1);
          }
        }
      }
    },

    db: {
      set: function(key, value){
        window.localStorage.setItem(gin.LOCAL_STORAGE_PREFIX + key, value)
      },

      get: function(key){
        return window.localStorage.getItem(gin.LOCAL_STORAGE_PREFIX + key);
      }
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
})(window);
