gin.ns('gin.utils',  {
  isNumber: function(obj) {
    return (obj === +obj) || (toString.call(obj) === '[object Number]');
  },
  random: function (n) {
    var n = n || 1000000000;
    return Math.random() * n;
  }
});

