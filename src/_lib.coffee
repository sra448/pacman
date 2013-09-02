# i am going to define my functions global (because they should be global anyway)

window.toArray = (xs) -> [].slice.call xs

# curry and autoCurry stolen from wu.js
window.curry = (fn) ->
  args = [].slice.call arguments, 1
  -> fn.apply this, (args.concat (toArray arguments))

window.autoCurry = (fn, numArgs = fn.length) ->
  ->
    if arguments.length < numArgs
      if numArgs - arguments.length > 0
        autoCurry (curry.apply this, ([fn].concat (toArray arguments))), numArgs - arguments.length
      else
        curry.apply this, ([fn].concat (toArray arguments))
    else
      fn.apply this, arguments

window.join = autoCurry (delimiter, xs) -> xs.join delimiter

window.dot = autoCurry (prop, x) -> x?[prop]

window.map = autoCurry (fn, xs) -> xs?.map? fn

# stolen from underscore.js
window.compose = (funcs...) ->
  lastFuncIndex = funcs.length - 1
  (args...) ->
    args = [funcs[lastFuncIndex - i].apply this, args] for _, i in funcs
    args[0]

# some predicates
window.equalsP = autoCurry (a, b) -> a == b
window.undefinedP = equalsP undefined

# some html elements
window.Tag = autoCurry (name, id, content) -> "<#{name}#{" class=#{id}" if id?}>#{content}</#{name}>"
window.Div = Tag "div"

window.setProperty = autoCurry (el, name, value) -> el[name] = value

window.contains = (a, xs) ->
  return true if x == a for x in xs
  false
