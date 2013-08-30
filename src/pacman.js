(function() {
  var Direction, canWalkThere, draw, enemyP, foodP, gameloop, getPossibleDirections, lookupArea, setArea, startGame, transformObject, transformPosition, transformWorld, wallP, world;

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
      view: "O"
    },
    enemySpawns: [[12, 12], [12, 14], [12, 16]],
    enemies: [],
    area: [["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"], ["W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "W"], ["W", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", ".", "W", "W", ".", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "W"], [".", ".", ".", ".", ".", "W", "+", "W", "W", "W", "W", "W", ".", "W", "W", ".", "W", "W", "W", "W", "W", "+", "W", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", "W", "W", "W", ".", ".", "W", "W", "W", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."], ["W", "W", "W", "W", "W", "W", "+", "W", "W", ".", "W", ".", ".", ".", ".", ".", ".", "W", ".", "W", "W", "+", "W", "W", "W", "W", "W", "W"], [".", ".", ".", ".", ".", ".", "+", ".", ".", ".", "W", ".", ".", ".", ".", ".", ".", "W", ".", ".", ".", "+", ".", ".", ".", ".", ".", "."], ["W", "W", "W", "W", "W", "W", "+", "W", "W", ".", "W", ".", ".", ".", ".", ".", ".", "W", ".", "W", "W", "+", "W", "W", "W", "W", "W", "W"], [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", "W", "W", "W", "W", "W", "W", "W", "W", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."], [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", "W", "W", "W", "W", "W", "W", "W", "W", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."], ["W", "W", "W", "W", "W", "W", "+", "W", "W", ".", "W", "W", "W", "W", "W", "W", "W", "W", ".", "W", "W", "+", "W", "W", "W", "W", "W", "W"], ["W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"], ["W", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "W"], ["W", "W", "W", "+", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "+", "W", "W", "W"], ["W", "W", "W", "+", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "+", "W", "W", "W"], ["W", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "W"], ["W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W"], ["W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W"], ["W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W"], ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"]]
  };

  draw = compose(setProperty(($("#world"))[0], 'innerHTML'), join("\n"), map(Div("row")), map(join("\n")), map(map(Div("cell"))), dot("area"));

  draw(world);

  wallP = equalsP("W");

  foodP = equalsP("+");

  enemyP = equalsP("E");

  canWalkThere = function(cell) {
    return (wallP(cell)) || (undefinedP(cell));
  };

  transformPosition = function(_arg, direction) {
    var x, y;
    x = _arg[0], y = _arg[1];
    switch (direction) {
      case Direction.left:
        return [x - 1, y];
      case Direction.right:
        return [x + 1, y];
      case Direction.top:
        return [x, y - 1];
      case Direction.down:
        return [x, y + 1];
    }
  };

  lookupArea = function(coordinates, xs) {
    var _ref;
    return (_ref = xs[coordinates[1]]) != null ? _ref[coordinates[0]] : void 0;
  };

  setArea = function(coordinates, value, xs) {
    return xs[coordinates[1]][coordinates[0]] = value;
  };

  getPossibleDirections = function(position, world) {
    var direction, value, _results;
    _results = [];
    for (direction in Direction) {
      value = Direction[direction];
      _results.push(canWalkThere(transformPosition(position, value)));
    }
    return _results;
  };

  transformObject = function(obj) {
    var aspiredPosition, awaitingDirection, newPosition;
    awaitingDirection = obj.awaitingDirection;
    newPosition = transformPosition(obj.position, obj.direction);
    if (awaitingDirection != null) {
      aspiredPosition = transformPosition(obj.position, awaitingDirection);
      if (!canWalkThere(lookupArea(aspiredPosition, world.area))) {
        newPosition = aspiredPosition;
        obj.direction = awaitingDirection;
        obj.awaitingDirection = void 0;
      }
    }
    if (!canWalkThere(lookupArea(newPosition, world.area))) {
      setArea(obj.position, "", world.area);
      setArea(newPosition, obj.view, world.area);
      return obj.position = newPosition;
    }
  };

  transformWorld = function(world) {
    var enemy, _i, _len, _ref, _results;
    transformObject(world.player);
    _ref = world.enemies;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      enemy = _ref[_i];
      _results.push(transformObject(enemy));
    }
    return _results;
  };

  gameloop = function() {
    transformWorld(world);
    draw(world);
    return setTimeout(gameloop, 300);
  };

  startGame = function() {
    $(document).on("keydown", function(e) {
      if (contains(e.keyCode, [37, 38, 39, 40])) {
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