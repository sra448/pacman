toArray = (xs) -> [].slice.call xs

negate = (x) -> !x

# curry and autoCurry stolen from wu.js
curry = (fn, args...) ->
  -> fn.apply this, (args.concat (toArray arguments))

autoCurry = (fn, numArgs = fn.length) ->
  ->
    if arguments.length < numArgs
      if numArgs - arguments.length > 0
        autoCurry (curry.apply this, ([fn].concat (toArray arguments))), numArgs - arguments.length
      else
        curry.apply this, ([fn].concat (toArray arguments))
    else
      fn.apply this, arguments

doDo = (funcs...) -> (params...) -> fn.apply {}, params for fn in funcs

doOr = autoCurry (a, b, params) -> (a.apply {}, params) || (b.apply {}, params)

getArray = (args...) -> args

first = (xs) -> xs?[0]

firstParam = (x) -> x

collect = (xs) -> (x for x in xs when x?)

getOtherInPair = autoCurry (a, [b, c]) ->
  if b + "" == a + ""
    c
  else if c + "" == a + ""
    b

join = autoCurry (delimiter, xs) -> xs.join delimiter

# access a property on x
dot = autoCurry (prop, x) -> x?[prop]

# map uses the xs map function
map = autoCurry (fn, xs) -> xs?.map? fn

# stolen from underscore.js
compose = (funcs...) ->
  lastFuncIndex = funcs.length - 1
  (args...) ->
    args = [funcs[lastFuncIndex - i].apply this, args] for _, i in funcs
    args[0]

# some predicates
equalsP = autoCurry (a, b) -> a == b

undefinedP = equalsP undefined

containsP = autoCurry (a, xs) ->
  return true for x in xs when x == a
  false

random = (max = 1) -> Math.random() * max

# some html constructors
HtmlParameter = (name, value) -> "#{name}='#{value}'"

HtmlTag = autoCurry (name, params, content) ->
  "<#{name} #{(HtmlParameter key, value for key, value of params).join(" ")}>#{content}</#{name}>"

Div = HtmlTag "div"

setProperty = autoCurry (el, name, value) -> el[name] = value

# Direction type uses keyCodes for easier assigning in events
Direction =
  top: 38
  right: 39
  down: 40
  left: 37

world =
  running: false
  points: 0
  player:
    speed: 4 # tiles per second
    position: [1, 1]
    direction: Direction.right
    view: "\u15E7"
  portals:
    37: [[[0, 14], [27, 14]]] # 37 = Direction.left
    39: [[[27, 14], [0, 14]]] # 39 = Direction.right
  enemySpawns: [[14, 14]]
  maxEnemies: 4
  enemies: []
  area: [["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"]
         ["W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W", "W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W"]
         ["W", " ", "W", "W", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", "W", "W", " ", "W"]
         ["W", " ", "W", "W", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", "W", "W", " ", "W"]
         ["W", " ", "W", "W", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", "W", "W", " ", "W"]
         ["W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W"]
         ["W", " ", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", " ", "W"]
         ["W", " ", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", " ", "W"]
         ["W", " ", " ", " ", " ", " ", " ", "W", "W", " ", " ", " ", " ", "W", "W", " ", " ", " ", " ", "W", "W", " ", " ", " ", " ", " ", " ", "W"]
         ["W", "W", "W", "W", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", "W", "W", "W", "W"]
         [" ", " ", " ", " ", " ", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", " ", " ", " ", " ", " "]
         [" ", " ", " ", " ", " ", "W", " ", "W", "W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W", "W", " ", "W", " ", " ", " ", " ", " "]
         [" ", " ", " ", " ", " ", "W", " ", "W", "W", " ", "W", "W", "W", " ", " ", "W", "W", "W", " ", "W", "W", " ", "W", " ", " ", " ", " ", " "]
         ["W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", " ", " ", " ", " ", " ", " ", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W"]
         ["<", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W", " ", " ", " ", " ", " ", " ", "W", " ", " ", " ", " ", " ", " ", " ", " ", " ", ">"]
         ["W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", " ", " ", "W", " ", " ", " ", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W"]
         [" ", " ", " ", " ", " ", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", " ", " ", " ", " ", " "]
         [" ", " ", " ", " ", " ", "W", " ", "W", "W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W", "W", " ", "W", " ", " ", " ", " ", " "]
         [" ", " ", " ", " ", " ", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", " ", " ", " ", " ", " "]
         ["W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W"]
         ["W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W", "W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W"]
         ["W", " ", "W", "W", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", "W", "W", " ", "W"]
         ["W", " ", "W", "W", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", " ", "W", "W", "W", "W", " ", "W"]
         ["W", " ", " ", " ", "W", "W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W", "W", " ", " ", " ", "W"]
         ["W", "W", "W", " ", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", " ", "W", "W", "W"]
         ["W", "W", "W", " ", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", " ", "W", "W", "W"]
         ["W", " ", " ", " ", " ", " ", " ", "W", "W", " ", " ", " ", " ", "W", "W", " ", " ", " ", " ", "W", "W", " ", " ", " ", " ", " ", " ", "W"]
         ["W", " ", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W"]
         ["W", " ", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W", "W", " ", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", " ", "W"]
         ["W", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "W"]
         ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"]]

draw = compose (setProperty ($ "#world")[0], 'innerHTML'), # send HTML to screen
               (join "\n"), # join divs with newline, get single html-string
               (map (Div { class: "row" })), # wrap that row-string into a another div
               (map (join "\n")), # join all cells in each row to string
               (map (map (Div { class: "cell" }))), # get a div-string for every item in 2d array
               (dot "area") # get the area of the world passed in

lookupArea = ([x, y], xs) -> xs[y]?[x]

setArea = ([x, y], value, xs) -> xs[y][x] = value

# some usefull predicates
lookupWallP = compose (equalsP "W"), lookupArea

lookupUndefinedP = compose (equalsP undefined), lookupArea

lookupEmptyP = compose (equalsP " "), lookupArea

lookupGoableP = compose negate, (doOr lookupWallP, lookupUndefinedP), getArray

lookupPortalP = (coordinates, direction) ->
  if world.portals[direction]?
    for [a, b] in world.portals[direction]
      return b if a + "" == coordinates + ""

transformCoordinates = ([x, y], direction, amount = 1) ->
  switch direction
    when Direction.left then [x - amount, y]
    when Direction.right then [x + amount, y]
    when Direction.top then [x, y - amount]
    when Direction.down then [x, y + amount]

resetCoordinatesDecimals = ([x, y], direction) ->
  switch direction
    when Direction.left then [(Math.ceil x + 0.001), y]
    when Direction.right then [(Math.floor x), y]
    when Direction.top then [x, (Math.ceil y + 0.001)]
    when Direction.down then [x, (Math.floor y)]

setDirection = (obj, direction = obj.awaitingDirection) ->
  if direction? && direction != obj.direction
    aheadTile = transformCoordinates obj.currentTile, direction
    if lookupGoableP aheadTile, world.area
      obj.direction = direction
      obj.position = resetCoordinatesDecimals obj.position, obj.direction
      delete obj.awaitingDirection

teleport = (obj, world) ->
  newPosition = lookupPortalP obj.currentTile, obj.direction
  obj.position = resetCoordinatesDecimals newPosition, obj.direction if newPosition?

transformObject = (obj, amount, world, handleObject) ->
  obj.currentTile = map Math.floor, obj.position
  handleObject? obj, world
  aspiredPosition = transformCoordinates obj.position, obj.direction, (amount * obj.speed)
  aspiredTile = map Math.floor, aspiredPosition

  if obj.currentTile != aspiredTile && (lookupGoableP aspiredTile, world.area)
    setArea obj.currentTile, " ", world.area
    setArea aspiredTile, obj.view, world.area
    obj.position = aspiredPosition

handlePlayer = doDo (compose setDirection, firstParam), teleport

goableDirections = ([x, y], world) ->
  collect (for key, direction of Direction
    direction if lookupGoableP (transformCoordinates [x, y], direction), world.area)

randomDirection = (obj, world) ->
  directions = goableDirections obj.currentTile, world
  directions[Math.floor (random directions.length)]

handleEnemy = (enemy, world) ->
  aspiredTile = transformCoordinates enemy.currentTile, enemy.direction
  setDirection enemy, (randomDirection enemy, world) unless lookupGoableP aspiredTile, world.area

spawnEnemiesLoop = ->
  if world.running && world.enemies.length < world.maxEnemies
    setTimeout spawnEnemiesLoop, 3000
    if lookupEmptyP world.enemySpawns[0], world.area
      world.enemies.push
        position: world.enemySpawns[0]
        direction: Direction.top
        speed: 5
        view: "E"

prevTime = 0
gameLoop = (runningTime) ->
  requestAnimationFrame gameLoop if world.running

  if prevTime != 0
    amount = (runningTime - prevTime) / 1000
    transformObject world.player, amount, world, handlePlayer
    transformObject enemy, amount, world, handleEnemy for enemy in world.enemies
    draw world
  prevTime = runningTime if world.running

startPause = (stop = false) ->
  if !world.running
    world.running = true
    requestAnimationFrame gameLoop
    spawnEnemiesLoop()
  else if stop
    world.running = false
    prevTime = 0

startGame = ->
  draw world
  $(document).on "keydown", (e) ->
    if containsP e.keyCode, [37, 38, 39, 40, 32]
      e.preventDefault()
      world.player.awaitingDirection = e.keyCode if containsP e.keyCode, [37, 38, 39, 40]
      startPause (e.keyCode == 32)

startGame()
