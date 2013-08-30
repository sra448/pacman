# Direction "Enum" uses keyCodes for easier assigning in events
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
    view: "O"
  enemies: [
    { position: [7, 5], direction: Direction.left, view: "E" }
  ]
  area: [['p', '+', '+', '+', '+', 'w', 'w', '+', '+', '+']
         ['+', 'w', '+', 'w', '+', '+', 'w', '+', '+', '+']
         ['+', 'w', '+', 'w', '+', '+', 'w', '+', '+', '+']
         ['+', 'w', '+', '+', '+', '+', 'w', '+', '+', '+']
         ['+', 'w', 'w', 'w', '+', '+', '+', '+', '+', '+']
         ['+', 'w', '+', 'w', '+', '+', '+', 'e', '+', '+']
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

transformPosition = ([x, y], direction) ->
  switch direction
    when Direction.left then [x-1, y]
    when Direction.right then [x+1, y]
    when Direction.top then [x, y-1]
    when Direction.down then [x, y+1]

lookupArea = (coordinates, xs) -> xs[coordinates[1]]?[coordinates[0]]
setArea = (coordinates, value, xs) -> xs[coordinates[1]][coordinates[0]] = value

getPossibleDirections = (position, world) ->
  canWalkThere (transformPosition position, value) for direction, value of Direction

transformObject = (obj) ->
  awaitingDirection = obj.awaitingDirection
  newPosition = transformPosition obj.position, obj.direction

  if awaitingDirection?
    aspiredPosition = transformPosition obj.position, awaitingDirection
    if !canWalkThere (lookupArea aspiredPosition, world.area)
      newPosition = aspiredPosition
      obj.direction = awaitingDirection
      obj.awaitingDirection = undefined

  if !canWalkThere (lookupArea newPosition, world.area)
    setArea obj.position, "", world.area
    setArea newPosition, obj.view, world.area
    obj.position = newPosition

transformWorld = (world) ->
  transformObject world.player
  transformObject enemy for enemy in world.enemies

gameloop = ->
  transformWorld world
  draw world
  setTimeout gameloop, 450

startGame = ->
  $(document).on "keydown", (e) -> world.player.awaitingDirection = e.keyCode if contains e.keyCode, [37, 38, 39, 40]
  gameloop()

startGame()
