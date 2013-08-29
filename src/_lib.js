(function() {
  var __slice = [].slice;

  window.toArray = function(xs) {
    return [].slice.call(xs);
  };

  window.curry = function(fn) {
    var args;
    args = [].slice.call(arguments, 1);
    return function() {
      return fn.apply(this, args.concat(toArray(arguments)));
    };
  };

  window.autoCurry = function(fn, numArgs) {
    if (numArgs == null) {
      numArgs = fn.length;
    }
    return function() {
      if (arguments.length < numArgs) {
        if (numArgs - arguments.length > 0) {
          return autoCurry(curry.apply(this, [fn].concat(toArray(arguments))), numArgs - arguments.length);
        } else {
          return curry.apply(this, [fn].concat(toArray(arguments)));
        }
      } else {
        return fn.apply(this, arguments);
      }
    };
  };

  window.join = autoCurry(function(delimiter, xs) {
    return xs.join(delimiter);
  });

  window.dot = autoCurry(function(prop, x) {
    return x != null ? x[prop] : void 0;
  });

  window.map = autoCurry(function(fn, xs) {
    return xs != null ? typeof xs.map === "function" ? xs.map(fn) : void 0 : void 0;
  });

  window.compose = function() {
    var funcs, lastFuncIndex;
    funcs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    lastFuncIndex = funcs.length - 1;
    return function() {
      var args, i, _, _i, _len;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (i = _i = 0, _len = funcs.length; _i < _len; i = ++_i) {
        _ = funcs[i];
        args = [funcs[lastFuncIndex - i].apply(this, args)];
      }
      return args[0];
    };
  };

  window.equalsP = autoCurry(function(a, b) {
    return a === b;
  });

  window.undefinedP = equalsP(void 0);

  window.Tag = autoCurry(function(name, id, content) {
    return "<" + name + (id != null ? " class=" + id : void 0) + ">" + content + "</" + name + ">";
  });

  window.Div = Tag("div");

  window.setProperty = autoCurry(function(el, name, value) {
    return el[name] = value;
  });

}).call(this);

/*
//@ sourceMappingURL=_lib.js.map
*/