# no need for require yet (only two files and a lot of globals)

Direction =
  top: 38
  right: 39
  down: 40
  left: 37

world =
  points: 0
  player:
    position: [0, 0]
    direction: Direction.right
  area: [['p', '+', '+', '+', '+', 'w', 'w', '+', '+', '+']
         ['+', 'w', '+', 'w', '+', '+', 'w', '+', '+', '+']
         ['+', 'w', '+', 'w', '+', '+', 'w', '+', '+', '+']
         ['+', 'w', '+', '+', '+', '+', 'w', '+', '+', '+']
         ['+', 'w', 'w', 'w', '+', '+', '+', '+', '+', '+']
         ['+', 'w', '+', 'w', '+', '+', '+', '+', '+', '+']
         ['+', 'w', '+', 'w', '+', '+', 'w', 'w', 'w', '+']
         ['+', 'w', '+', '+', '+', '+', '+', '+', '+', '+']]

draw = compose (setProperty ($ "#world")[0], 'innerHTML'),
               (join "\n"),
               (map (Div "row")),
               (map (join "\n")),
               (map (map (Div "cell"))),
               (dot "area")

# console.log "foo", draw world
draw world

wallP = equalsP "w"
foodP = equalsP "+"
enemyP = equalsP "e"

transformPosition = (xy, direction) ->
  [x, y] = xy
  switch direction
    when Direction.left then [x-1, y]
    when Direction.right then [x+1, y]
    when Direction.top then [x, y-1]
    when Direction.down then [x, y+1]

lookupArea = (coordinates, xs) -> xs[coordinates[1]][coordinates[0]]
setArea = (coordinates, value, xs) -> xs[coordinates[1]][coordinates[0]] = value

transformWorld = (world) ->
  player = world.player
  newPosition = transformPosition player.position, player.direction

  if !wallP (lookupArea newPosition, world.area)
    setArea player.position, "", world.area
    setArea newPosition, "P", world.area
    player.position = newPosition

gameloop = ->
  transformWorld world
  draw world
  setTimeout (-> gameloop world), 300

startGame = ->
  $(document).on "keydown", (e) -> world.player.direction = e.keyCode
  gameloop()

startGame()
