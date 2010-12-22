gin.ns('gin.html', {});

gin.Class('gin.html.Element', {
  init: function (elementType, attributes, children) {
    this.element     = '';
    this.elementType = elementType || 'div';
    this.attributes  = attributes || {};
    this.children    = children || [];
    this.create();
  },

  html: null,

  create: function () {
    this.element += '<' + this.elementType;
    this.element += this.parseAttributes();
    this.element += '>';
    this.element += this.appendChildren();
    this.element += '</' + this.elementType + '>';
    this.html = this.element;

    //hack: returns a string preventing return of new object
    try { throw this.element; } catch (e) { return e; }
  },

  parseAttributes: function () {
    var attributes = '';
    for (var p in this.attributes) {
      var prop = p;
      if (p === 'className') {prop = 'class'; }
      attributes += ' ' + prop + '="' + this.attributes[p] + '"';
    }
    return attributes;
  },

  appendChildren: function () {
    var children = '';
    for (var i = 0, ii = this.children.length; i < ii; i++) {
      children += this.children[i];
    }
    return children;
  }
});

