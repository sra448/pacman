toArray = (xs) -> [].slice.call xs

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

doOr = autoCurry (a, b, params) -> (a.apply {}, params) || (b.apply {}, params)

getArrayFromArguments = (args...) -> args

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
  enemySpawns: [[12, 12], [12, 14], [12, 16]]
  enemies: []
  area: [["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"]
         ["W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W"]
         ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"]
         ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"]
         ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"]
         ["W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W"]
         ["W", "+", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "+", "W"]
         ["W", "+", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "+", "W"]
         ["W", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "W"]
         ["W", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", ".", "W", "W", ".", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "W"]
         [".", ".", ".", ".", ".", "W", "+", "W", "W", "W", "W", "W", ".", "W", "W", ".", "W", "W", "W", "W", "W", "+", "W", ".", ".", ".", ".", "."]
         [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."]
         [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", "W", "W", "W", ".", ".", "W", "W", "W", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."]
         ["W", "W", "W", "W", "W", "W", "+", "W", "W", ".", "W", ".", ".", ".", ".", ".", ".", "W", ".", "W", "W", "+", "W", "W", "W", "W", "W", "W"]
         ["W", ".", ".", ".", ".", ".", "+", ".", ".", ".", "W", ".", ".", ".", ".", ".", ".", "W", ".", ".", ".", "+", ".", ".", ".", ".", ".", "W"]
         ["W", "W", "W", "W", "W", "W", "+", "W", "W", ".", "W", ".", ".", ".", ".", ".", ".", "W", ".", "W", "W", "+", "W", "W", "W", "W", "W", "W"]
         [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", "W", "W", "W", "W", "W", "W", "W", "W", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."]
         [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."]
         [".", ".", ".", ".", ".", "W", "+", "W", "W", ".", "W", "W", "W", "W", "W", "W", "W", "W", ".", "W", "W", "+", "W", ".", ".", ".", ".", "."]
         ["W", "W", "W", "W", "W", "W", "+", "W", "W", ".", "W", "W", "W", "W", "W", "W", "W", "W", ".", "W", "W", "+", "W", "W", "W", "W", "W", "W"]
         ["W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W"]
         ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"]
         ["W", "+", "W", "W", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "+", "W", "W", "W", "W", "+", "W"]
         ["W", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "W"]
         ["W", "W", "W", "+", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "+", "W", "W", "W"]
         ["W", "W", "W", "+", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "+", "W", "W", "W"]
         ["W", "+", "+", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "W", "W", "+", "+", "+", "+", "+", "+", "W"]
         ["W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W"]
         ["W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W", "W", "+", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "+", "W"]
         ["W", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "+", "W"]
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
wallP = compose (equalsP "W"), lookupArea

transformCoordinates = ([x, y], direction, amount = 1) ->
  switch direction
    when Direction.left then [x-amount, (Math.floor y)]
    when Direction.right then [x+amount, (Math.floor y)]
    when Direction.top then [(Math.floor x), y-amount]
    when Direction.down then [(Math.floor x), y+amount]

setDirection = (obj, amount, currentTile) ->
  if obj.awaitingDirection?
    newAspiredTile = transformCoordinates currentTile, obj.awaitingDirection
    if !wallP newAspiredTile, world.area
      obj.direction = obj.awaitingDirection
      obj.awaitingDirection = undefined
      newAspiredTile

transformObject = (obj, amount, onChangeTile) ->
  currentTile = map Math.floor, obj.position
  aspiredPosition = transformCoordinates obj.position, obj.direction, (amount * obj.speed)
  aspiredTile = map Math.floor, aspiredPosition
  aspiredTile = (onChangeTile obj, amount, currentTile, aspiredTile) || aspiredTile

  if currentTile != aspiredTile && (!wallP aspiredTile, world.area)
    setArea currentTile, "", world.area
    setArea aspiredTile, obj.view, world.area
    obj.position = aspiredPosition

prevTime = 0
gameloop = (runningTime) ->
  requestAnimationFrame gameloop if world.running

  if prevTime != 0
    amount = (runningTime - prevTime) / 1000
    transformObject world.player, amount, setDirection
    draw world
  prevTime = runningTime if world.running

startGame = ->
  draw world
  $(document).on "keydown", (e) ->
    if containsP e.keyCode, [37, 38, 39, 40, 32]
      e.preventDefault()
      world.player.awaitingDirection = e.keyCode if containsP e.keyCode, [37, 38, 39, 40]

      if !world.running
        world.running = true
        requestAnimationFrame gameloop
      else if e.keyCode == 32
        world.running = false
        prevTime = 0

startGame()
