(function() {
  var Direction, Div, HtmlParameter, HtmlTag, autoCurry, compose, containsP, curry, doOr, dot, draw, enemyP, equalsP, foodP, gameloop, getArrayFromArguments, getPossibleDirections, join, lookupArea, map, prevTime, setArea, setProperty, startGame, thinkPlayer, toArray, transformCoordinates, transformObject, transformWorld, undefinedP, walkableP, wallP, world,
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
    points: 0,
    player: {
      position: [1, 1],
      direction: Direction.right,
      view: "\u15E7"
    },
    enemySpawns: [[12, 12], [12, 14], [12, 16]],
    enemies: [],
    area: [["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"], ["W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "W"], ["W", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", ".", "W", "W", ".", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "W"], [".", ".", ".", ".", ".", "W", "+", "W", "W", "W", "W", "W", ".", "W", "W", ".", "W", "W", "W", "W", "W", "+", "W", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", "W", "W", "W", ".", ".", "W", "W", "W", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."], ["W", "W", "W", "W", "W", "W", "+", "W", "W", ".", "W", ".", ".", ".", ".", ".", ".", "W", ".", "W", "W", "+", "W", "W", "W", "W", "W", "W"], ["P", ".", ".", ".", ".", ".", "+", ".", ".", ".", "W", ".", ".", ".", ".", ".", ".", "W", ".", ".", ".", "+", ".", ".", ".", ".", ".", "P"], ["W", "W", "W", "W", "W", "W", "+", "W", "W", ".", "W", ".", ".", ".", ".", ".", ".", "W", ".", "W", "W", "+", "W", "W", "W", "W", "W", "W"], [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", "W", "W", "W", "W", "W", "W", "W", "W", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", "W", "W", "W", "W", "W", "W", "W", "W", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."], ["W", "W", "W", "W", "W", "W", "+", "W", "W", ".", "W", "W", "W", "W", "W", "W", "W", "W", ".", "W", "W", "+", "W", "W", "W", "W", "W", "W"], ["W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "W"], ["W", "W", "W", "+", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "+", "W", "W", "W"], ["W", "W", "W", "+", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "+", "W", "W", "W"], ["W", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "W"], ["W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W"], ["W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W"], ["W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W"], ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"]]
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

  foodP = compose(equalsP("+"), lookupArea);

  enemyP = compose(equalsP("E"), lookupArea);

  walkableP = compose(doOr(wallP, undefinedP), getArrayFromArguments);

  transformCoordinates = function(_arg, direction, amount) {
    var x, y;
    x = _arg[0], y = _arg[1];
    if (amount == null) {
      amount = 1;
    }
    switch (direction) {
      case Direction.left:
        return [x - amount, y];
      case Direction.right:
        return [x + amount, y];
      case Direction.top:
        return [x, y - amount];
      case Direction.down:
        return [x, y + amount];
    }
  };

  getPossibleDirections = function(position) {
    var value, _, _results;
    _results = [];
    for (_ in Direction) {
      value = Direction[_];
      if (walkableP(transformCoordinates(position, value), world.area)) {
        _results.push(value);
      }
    }
    return _results;
  };

  thinkPlayer = function(player) {
    var aspiredPosition, newPosition;
    if (player.awaitingDirection != null) {
      aspiredPosition = transformCoordinates(player.position, player.awaitingDirection);
      if (!walkableP(aspiredPosition, world.area)) {
        newPosition = aspiredPosition;
        player.direction = player.awaitingDirection;
        return player.awaitingDirection = void 0;
      }
    }
  };

  transformObject = function(obj, amount) {
    var newPosition;
    newPosition = transformCoordinates(obj.position, obj.direction, amount);
    if (!walkableP(newPosition, world.area)) {
      setArea(obj.position, "", world.area);
      setArea(newPosition, obj.view, world.area);
      return obj.position = newPosition;
    }
  };

  transformWorld = function(world) {
    return transformObject(world.player);
  };

  prevTime = 0;

  gameloop = function(actTime) {
    var time;
    time = (actTime - prevTime) / 100;
    prevTime = actTime;
    console.log(time);
    thinkPlayer(world.player);
    transformWorld(world, time);
    draw(world);
    return requestAnimationFrame(gameloop);
  };

  startGame = function() {
    draw(world);
    $(document).on("keydown", function(e) {
      if (containsP(e.keyCode, [37, 38, 39, 40])) {
        return world.player.awaitingDirection = e.keyCode;
      }
    });
    return gameloop();
  };

  startGame();

}).call(this);

/*
//@ sourceMappingURL=pacman.js.map
*/