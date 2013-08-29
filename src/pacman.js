(function() {
  var Direction, draw, enemyP, foodP, gameloop, lookupArea, setArea, startGame, transformPosition, transformWorld, wallP, world;

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
    return xs[coordinates[1]][coordinates[0]];
  };

  setArea = function(coordinates, value, xs) {
    return xs[coordinates[1]][coordinates[0]] = value;
  };

  transformWorld = function(world) {
    var newPosition, player;
    player = world.player;
    newPosition = transformPosition(player.position, player.direction);
    if (!wallP(lookupArea(newPosition, world.area))) {
      setArea(player.position, "", world.area);
      setArea(newPosition, "P", world.area);
      return player.position = newPosition;
    }
  };

  gameloop = function() {
    transformWorld(world);
    draw(world);
    return setTimeout((function() {
      return gameloop(world);
    }), 300);
  };

  startGame = function() {
    $(document).on("keydown", function(e) {
      return world.player.direction = e.keyCode;
    });
    return gameloop();
  };

  startGame();

}).call(this);

/*
//@ sourceMappingURL=pacman.js.map
*/