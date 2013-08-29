(function() {
  var Direction, canWalkThere, draw, enemyP, foodP, gameloop, lookupArea, setArea, startGame, transformPosition, transformWorld, wallP, world;

  Direction = {
    top: 38,
    right: 39,
    down: 40,
    left: 37
  };

  world = {
    points: 0,
    player: {
      position: [0, 0],
      direction: Direction.right
    },
    area: [['p', '+', '+', '+', '+', 'w', 'w', '+', '+', '+'], ['+', 'w', '+', 'w', '+', '+', 'w', '+', '+', '+'], ['+', 'w', '+', 'w', '+', '+', 'w', '+', '+', '+'], ['+', 'w', '+', '+', '+', '+', 'w', '+', '+', '+'], ['+', 'w', 'w', 'w', '+', '+', '+', '+', '+', '+'], ['+', 'w', '+', 'w', '+', '+', '+', '+', '+', '+'], ['+', 'w', '+', 'w', '+', '+', 'w', 'w', 'w', '+'], ['+', 'w', '+', '+', '+', '+', '+', '+', '+', '+']]
  };

  draw = compose(setProperty(($("#world"))[0], 'innerHTML'), join("\n"), map(Div("row")), map(join("\n")), map(map(Div("cell"))), dot("area"));

  draw(world);

  wallP = equalsP("w");

  foodP = equalsP("+");

  enemyP = equalsP("e");

  canWalkThere = function(cell) {
    return (wallP(cell)) || (undefinedP(cell));
  };

  transformPosition = function(xy, direction) {
    var x, y;
    x = xy[0], y = xy[1];
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

  transformWorld = function(world) {
    var aspiredPosition, awaitingDirection, newPosition, player;
    player = world.player;
    awaitingDirection = player.awaitingDirection;
    newPosition = transformPosition(player.position, player.direction);
    if (awaitingDirection != null) {
      aspiredPosition = transformPosition(player.position, awaitingDirection);
      if (!canWalkThere(lookupArea(aspiredPosition, world.area))) {
        newPosition = aspiredPosition;
        player.direction = awaitingDirection;
        player.awaitingDirection = void 0;
      }
    }
    if (!canWalkThere(lookupArea(newPosition, world.area))) {
      setArea(player.position, "", world.area);
      setArea(newPosition, "P", world.area);
      return player.position = newPosition;
    }
  };

  gameloop = function() {
    transformWorld(world);
    draw(world);
    return setTimeout(gameloop, 450);
  };

  startGame = function() {
    $(document).on("keydown", function(e) {
      return world.player.awaitingDirection = e.keyCode;
    });
    return gameloop();
  };

  startGame();

}).call(this);

/*
//@ sourceMappingURL=pacman.js.map
*/