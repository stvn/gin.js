gin.ns('gin.enumerable', {
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
});

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
