(function() {
  var Direction, Div, HtmlParameter, HtmlTag, autoCurry, collect, compose, containsP, curry, doDo, doOr, dot, draw, equalsP, first, firstParam, gameLoop, getArray, getOtherInPair, goableDirections, handleEnemy, handlePlayer, join, lookupArea, lookupEmptyP, lookupGoableP, lookupPortalP, lookupUndefinedP, lookupWallP, map, negate, prevTime, random, randomDirection, resetCoordinatesDecimals, setArea, setDirection, setProperty, spawnEnemiesLoop, startGame, startPause, teleport, toArray, transformCoordinates, transformObject, undefinedP, world,
    __slice = [].slice;

  toArray = function(xs) {
    return [].slice.call(xs);
  };

  negate = function(x) {
    return !x;
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

  doDo = function() {
    var funcs;
    funcs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return function() {
      var fn, params, _i, _len, _results;
      params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = funcs.length; _i < _len; _i++) {
        fn = funcs[_i];
        _results.push(fn.apply({}, params));
      }
      return _results;
    };
  };

  doOr = autoCurry(function(a, b, params) {
    return (a.apply({}, params)) || (b.apply({}, params));
  });

  getArray = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return args;
  };

  first = function(xs) {
    return xs != null ? xs[0] : void 0;
  };

  firstParam = function(x) {
    return x;
  };

  collect = function(xs) {
    var x, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = xs.length; _i < _len; _i++) {
      x = xs[_i];
      if (x != null) {
        _results.push(x);
      }
    }
    return _results;
  };

  getOtherInPair = autoCurry(function(a, _arg) {
    var b, c;
    b = _arg[0], c = _arg[1];
    if (b + "" === a + "") {
      return c;
    } else if (c + "" === a + "") {
      return b;
    }
  });

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

  random = function(max) {
    if (max == null) {
      max = 1;
    }
    return Math.random() * max;
  };

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
    portals: {
      37: [[[0, 14], [27, 14]]],
      39: [[[27, 14], [0, 14]]]
    },
    enemySpawns: [[14, 14]],
    maxEnemies: 4,
    enemies: [],
    area: [["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"], ["W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W", "W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W"], ["W", " ", "W", "W", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", "W", "W", " ", "W"], ["W", " ", "W", "W", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", "W", "W", " ", "W"], ["W", " ", "W", "W", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", "W", "W", " ", "W"], ["W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W"], ["W", " ", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", " ", "W"], ["W", " ", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", " ", "W"], ["W", " ", " ", " ", " ", " ", " ", "W", "W", " ", " ", " ", " ", "W", "W", " ", " ", " ", " ", "W", "W", " ", " ", " ", " ", " ", " ", "W"], ["W", "W", "W", "W", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", "W", "W", "W", "W"], [" ", " ", " ", " ", " ", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", " ", " ", " ", " ", " "], [" ", " ", " ", " ", " ", "W", " ", "W", "W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W", "W", " ", "W", " ", " ", " ", " ", " "], [" ", " ", " ", " ", " ", "W", " ", "W", "W", " ", "W", "W", "W", " ", " ", "W", "W", "W", " ", "W", "W", " ", "W", " ", " ", " ", " ", " "], ["W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", " ", " ", " ", " ", " ", " ", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W"], ["<", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W", " ", " ", " ", " ", " ", " ", "W", " ", " ", " ", " ", " ", " ", " ", " ", " ", ">"], ["W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", " ", " ", "W", " ", " ", " ", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W"], [" ", " ", " ", " ", " ", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", " ", " ", " ", " ", " "], [" ", " ", " ", " ", " ", "W", " ", "W", "W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W", "W", " ", "W", " ", " ", " ", " ", " "], [" ", " ", " ", " ", " ", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", " ", " ", " ", " ", " "], ["W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W"], ["W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W", "W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W"], ["W", " ", "W", "W", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", "W", "W", " ", "W"], ["W", " ", "W", "W", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", "W", "W", " ", "W"], ["W", " ", " ", " ", "W", "W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W", "W", " ", " ", " ", "W"], ["W", "W", "W", " ", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", " ", "W", "W", "W"], ["W", "W", "W", " ", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", " ", "W", "W", "W"], ["W", " ", " ", " ", " ", " ", " ", "W", "W", " ", " ", " ", " ", "W", "W", " ", " ", " ", " ", "W", "W", " ", " ", " ", " ", " ", " ", "W"], ["W", " ", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W"], ["W", " ", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W"], ["W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W"], ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"]]
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

  lookupWallP = compose(equalsP("W"), lookupArea);

  lookupUndefinedP = compose(equalsP(void 0), lookupArea);

  lookupEmptyP = compose(equalsP(" "), lookupArea);

  lookupGoableP = compose(negate, doOr(lookupWallP, lookupUndefinedP), getArray);

  lookupPortalP = function(coordinates, direction) {
    var a, b, _i, _len, _ref, _ref1;
    if (world.portals[direction] != null) {
      _ref = world.portals[direction];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], a = _ref1[0], b = _ref1[1];
        if (a + "" === coordinates + "") {
          return b;
        }
      }
    }
  };

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

  setDirection = function(obj, direction) {
    var aheadTile;
    if (direction == null) {
      direction = obj.awaitingDirection;
    }
    if ((direction != null) && direction !== obj.direction) {
      aheadTile = transformCoordinates(obj.currentTile, direction);
      if (lookupGoableP(aheadTile, world.area)) {
        obj.direction = direction;
        obj.position = resetCoordinatesDecimals(obj.position, obj.direction);
        return delete obj.awaitingDirection;
      }
    }
  };

  teleport = function(obj, world) {
    var newPosition;
    newPosition = lookupPortalP(obj.currentTile, obj.direction);
    if (newPosition != null) {
      return obj.position = resetCoordinatesDecimals(newPosition, obj.direction);
    }
  };

  transformObject = function(obj, amount, world, handleObject) {
    var aspiredPosition, aspiredTile;
    obj.currentTile = map(Math.floor, obj.position);
    if (typeof handleObject === "function") {
      handleObject(obj, world);
    }
    aspiredPosition = transformCoordinates(obj.position, obj.direction, amount * obj.speed);
    aspiredTile = map(Math.floor, aspiredPosition);
    if (obj.currentTile !== aspiredTile && (lookupGoableP(aspiredTile, world.area))) {
      setArea(obj.currentTile, " ", world.area);
      setArea(aspiredTile, obj.view, world.area);
      return obj.position = aspiredPosition;
    }
  };

  handlePlayer = doDo(compose(setDirection, firstParam), teleport);

  goableDirections = function(_arg, world) {
    var direction, key, x, y;
    x = _arg[0], y = _arg[1];
    return collect((function() {
      var _results;
      _results = [];
      for (key in Direction) {
        direction = Direction[key];
        if (lookupGoableP(transformCoordinates([x, y], direction), world.area)) {
          _results.push(direction);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    })());
  };

  randomDirection = function(obj, world) {
    var directions;
    directions = goableDirections(obj.currentTile, world);
    return directions[Math.floor(random(directions.length))];
  };

  handleEnemy = function(enemy, world) {
    var aspiredTile;
    aspiredTile = transformCoordinates(enemy.currentTile, enemy.direction);
    if (!lookupGoableP(aspiredTile, world.area)) {
      return setDirection(enemy, randomDirection(enemy, world));
    }
  };

  spawnEnemiesLoop = function() {
    if (world.running && world.enemies.length < world.maxEnemies) {
      setTimeout(spawnEnemiesLoop, 3000);
      if (lookupEmptyP(world.enemySpawns[0], world.area)) {
        return world.enemies.push({
          position: world.enemySpawns[0],
          direction: Direction.top,
          speed: 5,
          view: "E"
        });
      }
    }
  };

  prevTime = 0;

  gameLoop = function(runningTime) {
    var amount, enemy, _i, _len, _ref;
    if (world.running) {
      requestAnimationFrame(gameLoop);
    }
    if (prevTime !== 0) {
      amount = (runningTime - prevTime) / 1000;
      transformObject(world.player, amount, world, handlePlayer);
      _ref = world.enemies;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        enemy = _ref[_i];
        transformObject(enemy, amount, world, handleEnemy);
      }
      draw(world);
    }
    if (world.running) {
      return prevTime = runningTime;
    }
  };

  startPause = function(stop) {
    if (stop == null) {
      stop = false;
    }
    if (!world.running) {
      world.running = true;
      requestAnimationFrame(gameLoop);
      return spawnEnemiesLoop();
    } else if (stop) {
      world.running = false;
      return prevTime = 0;
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
        return startPause(e.keyCode === 32);
      }
    });
  };

  startGame();

}).call(this);

/*
//@ sourceMappingURL=pacman.js.map
*/