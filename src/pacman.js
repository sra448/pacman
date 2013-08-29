(function() {
  var draw, world;

  world = {
    points: 0,
    currentDirection: 0x0100,
    area: [['p', 'f', 'f', 'w', 'f', 'f', 'f', 'f', 'f', 'f'], ['f', 'w', 'f', 'w', 'f', 'f', 'f', 'f', 'f', 'f'], ['f', 'w', 'f', 'w', 'f', 'f', 'f', 'f', 'f', 'f'], ['f', 'w', 'f', 'w', 'f', 'f', 'f', 'f', 'f', 'f'], ['f', 'w', 'f', 'w', 'f', 'f', 'f', 'f', 'f', 'f'], ['f', 'w', 'f', 'w', 'f', 'f', 'f', 'f', 'f', 'f'], ['f', 'w', 'f', 'w', 'f', 'f', 'f', 'f', 'f', 'f'], ['f', 'w', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f']]
  };

  draw = compose(join("\n"), map(Div("row")), map(join("\n")), map(map(Div("cell"))), dot("area"));

  Sizzle("#world")[0].innerHTML = draw(world);

}).call(this);

/*
//@ sourceMappingURL=pacman.js.map
*/