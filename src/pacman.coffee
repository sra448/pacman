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
canWalkThere = (cell) -> (wallP cell) || (undefinedP cell)

transformPosition = (xy, direction) ->
  [x, y] = xy
  switch direction
    when Direction.left then [x-1, y]
    when Direction.right then [x+1, y]
    when Direction.top then [x, y-1]
    when Direction.down then [x, y+1]

lookupArea = (coordinates, xs) -> xs[coordinates[1]]?[coordinates[0]]
setArea = (coordinates, value, xs) -> xs[coordinates[1]][coordinates[0]] = value

transformWorld = (world) ->
  player = world.player
  awaitingDirection = player.awaitingDirection
  newPosition = transformPosition player.position, player.direction

  if awaitingDirection?
    aspiredPosition = transformPosition player.position, awaitingDirection
    if !canWalkThere (lookupArea aspiredPosition, world.area)
      newPosition = aspiredPosition
      player.direction = awaitingDirection
      player.awaitingDirection = undefined

  if !canWalkThere (lookupArea newPosition, world.area)
    setArea player.position, "", world.area
    setArea newPosition, "P", world.area
    player.position = newPosition

gameloop = ->
  transformWorld world
  draw world
  setTimeout gameloop, 450

startGame = ->
  $(document).on "keydown", (e) -> world.player.awaitingDirection = e.keyCode
  gameloop()

startGame()
