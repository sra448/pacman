# no need for require yet (only two files and a lot of globals)

world =
  points: 0
  currentDirection: 0x0100
  area: [['p', 'f', 'f', 'w', 'f', 'f', 'f', 'f', 'f', 'f']
         ['f', 'w', 'f', 'w', 'f', 'f', 'f', 'f', 'f', 'f']
         ['f', 'w', 'f', 'w', 'f', 'f', 'f', 'f', 'f', 'f']
         ['f', 'w', 'f', 'w', 'f', 'f', 'f', 'f', 'f', 'f']
         ['f', 'w', 'f', 'w', 'f', 'f', 'f', 'f', 'f', 'f']
         ['f', 'w', 'f', 'w', 'f', 'f', 'f', 'f', 'f', 'f']
         ['f', 'w', 'f', 'w', 'f', 'f', 'f', 'f', 'f', 'f']
         ['f', 'w', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f']]

draw = compose (join "\n"),
               (map (Div "row")),
               (map (join "\n")),
               (map (map (Div "cell"))),
               (dot "area")

# console.log "foo", draw world
Sizzle("#world")[0].innerHTML = draw world

# transformWorld = (world) ->
