(function() {
  var Direction, Div, HtmlParameter, HtmlTag, autoCurry, compose, containsP, curry, doOr, dot, draw, equalsP, gameloop, getArrayFromArguments, join, lookupArea, map, prevTime, resetCoordinatesDecimals, setArea, setDirection, setProperty, startGame, toArray, transformCoordinates, transformObject, undefinedP, wallP, world,
    __slice = [].slice;

  toArray = function(xs) {
    return [].slice.call(xs);
  };

  curry = function() {
    var args, fn;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return function() {
      return fn.apply(this, args.concat(toArray(arguments)));
    };
  };

  autoCurry = function(fn, numArgs) {
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

  doOr = autoCurry(function(a, b, params) {
    return (a.apply({}, params)) || (b.apply({}, params));
  });

  getArrayFromArguments = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return args;
  };

  join = autoCurry(function(delimiter, xs) {
    return xs.join(delimiter);
  });

  dot = autoCurry(function(prop, x) {
    return x != null ? x[prop] : void 0;
  });

  map = autoCurry(function(fn, xs) {
    return xs != null ? typeof xs.map === "function" ? xs.map(fn) : void 0 : void 0;
  });

  compose = function() {
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

  equalsP = autoCurry(function(a, b) {
    return a === b;
  });

  undefinedP = equalsP(void 0);

  containsP = autoCurry(function(a, xs) {
    var x, _i, _len;
    for (_i = 0, _len = xs.length; _i < _len; _i++) {
      x = xs[_i];
      if (x === a) {
        return true;
      }
    }
    return false;
  });

  HtmlParameter = function(name, value) {
    return "" + name + "='" + value + "'";
  };

  HtmlTag = autoCurry(function(name, params, content) {
    var key, value;
    return "<" + name + " " + (((function() {
      var _results;
      _results = [];
      for (key in params) {
        value = params[key];
        _results.push(HtmlParameter(key, value));
      }
      return _results;
    })()).join(" ")) + ">" + content + "</" + name + ">";
  });

  Div = HtmlTag("div");

  setProperty = autoCurry(function(el, name, value) {
    return el[name] = value;
  });

  Direction = {
    top: 38,
    right: 39,
    down: 40,
    left: 37
  };

  world = {
    running: false,
    points: 0,
    player: {
      speed: 4,
      position: [1, 1],
      direction: Direction.right,
      view: "\u15E7"
    },
    enemySpawns: [[12, 12], [12, 14], [12, 16]],
    enemies: [],
    area: [["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"], ["W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "W"], ["W", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", ".", "W", "W", ".", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "W"], [".", ".", ".", ".", ".", "W", "+", "W", "W", "W", "W", "W", ".", "W", "W", ".", "W", "W", "W", "W", "W", "+", "W", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", "W", "W", "W", ".", ".", "W", "W", "W", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."], ["W", "W", "W", "W", "W", "W", "+", "W", "W", ".", "W", ".", ".", ".", ".", ".", ".", "W", ".", "W", "W", "+", "W", "W", "W", "W", "W", "W"], ["W", ".", ".", ".", ".", ".", "+", ".", ".", ".", "W", ".", ".", ".", ".", ".", ".", "W", ".", ".", ".", "+", ".", ".", ".", ".", ".", "W"], ["W", "W", "W", "W", "W", "W", "+", "W", "W", ".", "W", ".", ".", ".", ".", ".", ".", "W", ".", "W", "W", "+", "W", "W", "W", "W", "W", "W"], [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", "W", "W", "W", "W", "W", "W", "W", "W", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", "W", "W", "W", "W", "W", "W", "W", "W", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."], ["W", "W", "W", "W", "W", "W", "+", "W", "W", ".", "W", "W", "W", "W", "W", "W", "W", "W", ".", "W", "W", "+", "W", "W", "W", "W", "W", "W"], ["W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "W"], ["W", "W", "W", "+", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "+", "W", "W", "W"], ["W", "W", "W", "+", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "+", "W", "W", "W"], ["W", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "W"], ["W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W"], ["W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W"], ["W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W"], ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"]]
  };

  draw = compose(setProperty(($("#world"))[0], 'innerHTML'), join("\n"), map(Div({
    "class": "row"
  })), map(join("\n")), map(map(Div({
    "class": "cell"
  }))), dot("area"));

  lookupArea = function(_arg, xs) {
    var x, y, _ref;
    x = _arg[0], y = _arg[1];
    return (_ref = xs[y]) != null ? _ref[x] : void 0;
  };

  setArea = function(_arg, value, xs) {
    var x, y;
    x = _arg[0], y = _arg[1];
    return xs[y][x] = value;
  };

  wallP = compose(equalsP("W"), lookupArea);

  transformCoordinates = function(_arg, direction, amount) {
    var x, y;
    x = _arg[0], y = _arg[1];
    if (amount == null) {
      amount = 1;
    }
    switch (direction) {
      case Direction.left:
        return [x - amount, Math.floor(y)];
      case Direction.right:
        return [x + amount, Math.floor(y)];
      case Direction.top:
        return [Math.floor(x), y - amount];
      case Direction.down:
        return [Math.floor(x), y + amount];
    }
  };

  resetCoordinatesDecimals = function(_arg, direction) {
    var x, y;
    x = _arg[0], y = _arg[1];
    switch (direction) {
      case Direction.left:
        return [Math.ceil(x + 0.001), y];
      case Direction.right:
        return [Math.floor(x), y];
      case Direction.top:
        return [x, Math.ceil(y + 0.001)];
      case Direction.down:
        return [x, Math.floor(y)];
    }
  };

  setDirection = function(obj, amount, currentTile) {
    var aheadTile;
    if (obj.awaitingDirection != null) {
      aheadTile = transformCoordinates(currentTile, obj.awaitingDirection);
      if (!wallP(aheadTile, world.area)) {
        obj.direction = obj.awaitingDirection;
        obj.position = resetCoordinatesDecimals(obj.position, obj.direction);
        return obj.awaitingDirection = void 0;
      }
    }
  };

  transformObject = function(obj, amount, onChangeTile) {
    var aspiredPosition, aspiredTile, currentTile;
    currentTile = map(Math.floor, obj.position);
    if (typeof onChangeTile === "function") {
      onChangeTile(obj, amount, currentTile);
    }
    aspiredPosition = transformCoordinates(obj.position, obj.direction, amount * obj.speed);
    aspiredTile = map(Math.floor, aspiredPosition);
    if (currentTile !== aspiredTile && (!wallP(aspiredTile, world.area))) {
      setArea(currentTile, "", world.area);
      setArea(aspiredTile, obj.view, world.area);
      return obj.position = aspiredPosition;
    }
  };

  prevTime = 0;

  gameloop = function(runningTime) {
    var amount;
    if (world.running) {
      requestAnimationFrame(gameloop);
    }
    if (prevTime !== 0) {
      amount = (runningTime - prevTime) / 1000;
      transformObject(world.player, amount, setDirection);
      draw(world);
    }
    if (world.running) {
      return prevTime = runningTime;
    }
  };

  startGame = function() {
    draw(world);
    return $(document).on("keydown", function(e) {
      if (containsP(e.keyCode, [37, 38, 39, 40, 32])) {
        e.preventDefault();
        if (containsP(e.keyCode, [37, 38, 39, 40])) {
          world.player.awaitingDirection = e.keyCode;
        }
        if (!world.running) {
          world.running = true;
          return requestAnimationFrame(gameloop);
        } else if (e.keyCode === 32) {
          world.running = false;
          return prevTime = 0;
        }
      }
    });
  };

  startGame();

}).call(this);

/*
//@ sourceMappingURL=pacman.js.map
*/