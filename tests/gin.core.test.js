TestCase('gin', {
  'test should be defined': function() {
    assertObject(gin);
  },

  'test should have a Class function': function() {
    assertFunction(gin.Class);
  },

  'test should have a NS function': function() {
    assertFunction(gin.ns);
  },

  'test should create an empty object literal that is namespaced': function() {
    gin.ns('test.ns');
    assertObject(test.ns);
  },

  'test should create an object with properties and metods that is namespaced': function() {
    gin.ns('test.ns.a', { prop1: 5, prop2: 6 });
    assertEquals(5, test.ns.a.prop1);
    assertEquals(6, test.ns.a.prop2);
  },

  'test should create a constructor function that is namespaced': function() {
    gin.ns('test.ns.B', function(){ this.prop1 = 5; this.prop2 = 6; });
    var obj = new test.ns.B();
    assertEquals(5, obj.prop1);
    assertEquals(6, obj.prop2);
  }
});

TestCase('gin.oo', {
  'test should be an object': function() {
    assertObject(gin);
  },

  'test should have a CREATE function': function() {
    assertFunction(gin.oo.create);
  },

  'test should have an EXTEND function': function() {
    assertFunction(gin.oo.extend);
  },

  'test should have a MIXIN function': function() {
    assertFunction(gin.oo.mixin);
  },

  'test should have a _SUPER function': function() {
    assertFunction(gin.oo._super)
  }
});

TestCase('gin.Class', {
  setUp: function() {
    this.BaseClass = new gin.Class('ns.BaseClass', {declaredClass: 'BaseClass'});
  },

  tearDown: function() {
    delete this.BaseClass;
  },

  'test should create a new class': function() {
    assertFunction(this.BaseClass);
  },

  'test should insure new class can be instantiated': function() {
    var testObj   = new this.BaseClass();
    assertObject(testObj);
    assertEquals('BaseClass', testObj.declaredClass);
  },

  'test should create a new subclass': function() {
    var ExtClass = new gin.Class('ns.ExtClass', this.BaseClass, {
      declaredClass: 'ExtClass'
    });
    assertFunction(ExtClass);
  },

  'test should insure new subclass can be instantiated and has access to its super': function() {
    var ExtClass = new gin.Class('ns.ExtClass', this.BaseClass, {
          declaredClass: 'ExtClass'
        });
    var testObj = new ExtClass();

    assertObject(testObj);
    assertEquals('ExtClass',  testObj.declaredClass);
    assertEquals('BaseClass', testObj._super('declaredClass', []));
  },

  'test should call init when instantiated': function() {
    var value = null,
        TestClass = new gin.Class('gn.TestClass',{
          init: function() {
            value = 'working';
          }
        }),
        testObj = new TestClass();
    assertEquals('working', value);
  }
});

TestCase('gin.enumerable', {
  'test should be defined': function() {
    assertObject(gin.enumerable);
  },

  'test should have an object Break': function() {
    assertObject(gin.enumerable.Break);
  },

  'test should have an EACH function': function() {
    assertFunction(gin.enumerable.each);
  },

  'test should have a MAP function': function() {
    assertFunction(gin.enumerable.map);
  },

  'test should have a FILTER function': function() {
    assertFunction(gin.enumerable.filter);
  },

  'test shoud have a DETECT function': function() {
    assertFunction(gin.enumerable.detect);
  },

  'test should have a CHAIN function': function() {
  
  },

  'test should iterate through collection calling callback using each function': function() {
    var array1 = [1, 2, 3, 4, 5],
        array2 = [];
    gin.enumerable.each(array1, function(num){
      array2.push(num);
    });
    assertEquals(array1, array2);
  },

  'test should interate with map': function() {
    var array1 = [1, 2, 3, 4, 5],
        array2;
    array2 = gin.enumerable.map(array1, function(num){
      return num + 1;
    });
    assertEquals([2,3,4,5,6], array2);
  },

  'test should iterate and return a filtered array': function() {
    var array1 = [1, 2, 3, 4, 5],
        array2;
    array2 = gin.enumerable.filter(array1, function(num) {
      return num > 1 && num < 4;
    });
    assertEquals([2,3], array2);
  },

  'test should iterate and return the result detect': function() {
    var array1 = ['mo', 'larry', 'curly'],
        result;

    result = gin.enumerable.detect(array1, function(name){
      return name === 'larry';
    });
    assertEquals('larry', result);
  },

  'test should be able to chain enumerable methods': function() {
    var array1 = ['mo', 'larry', 'curly'],
        result;
    result = gin.enumerable.chain(array1).select(function(name){
      return name === 'mo' || name === 'curly';
    }).detect(function(name){
      return name === 'curly';
    }).values();
    assertEquals('curly', result);
  }
});

TestCase('gin.events', {
  'test should be defined': function() {
    assertObject(gin.events);
  }
});

TestCase('gin.ajax', {
  'test should be defined': function() {
    assertObject(gin.ajax);
  }
})


//TestCase('gin.dom', {
//  'test should be defined': function() {
//    assertObject(gin.dom);
//  },
//
//});
