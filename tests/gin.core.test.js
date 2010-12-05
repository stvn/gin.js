TestCase('gin', {
  'test should be defined': function() {
    assertObject(gin);
  },

  'test should have a Class function': function() {
    assertFunction(gin.Class);
  },

  'test should have a NS function': function() {
    assertFunction(gin.ns);
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
    this.BaseClass = new gin.Class({declaredClass: 'BaseClass'});
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
    var ExtClass = new gin.Class(this.BaseClass, {
      declaredClass: 'ExtClass'
    });
    assertFunction(ExtClass);
  },

  'test should insure new subclass can be instantiated and has access to its super': function() {
    var ExtClass = new gin.Class(this.BaseClass, {
          declaredClass: 'ExtClass'
        });
    var testObj = new ExtClass();

    assertObject(testObj);
    assertEquals('ExtClass',  testObj.declaredClass);
    assertEquals('BaseClass', testObj._super('declaredClass', []));
  },

  'test should call init when instantiated': function() {
    var value = null,
        TestClass = new gin.Class({
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

  'test should iterate through collection calling callback using each function': function() {
    var testArray1 = [1, 2, 3, 4, 5],
        testArray2 = [];

    gin.enumerable.each(testArray1, function(num){
      testArray2.push(num);
    });
    assertEquals(testArray1, testArray2);
  }


});
