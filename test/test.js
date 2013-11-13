var tape = require('tape')

var View = require('../')


tape('simple', function (t) {


  var v = View()

  //control the view by changing v.view, v.zoom, and v.center

  v.view.set(640, 480)
//  v.screen.size.set(640, 480)
  v.zoom.set(10, 10)
  v.center.set(132, 124)

  t.deepEqual(v.world.toJSON(), {x: 100, y: 100})
  t.deepEqual(v.world.bound.toJSON(), {x: 164, y: 148})

  v.center.set(100, 100)

  t.deepEqual(v.world.toJSON(), {x: 68, y: 76})
  t.deepEqual(v.world.bound.toJSON(), {x: 132, y: 124})

  v.zoom.set(16, 16)
  t.deepEqual(v.world.toJSON(), {x: 80, y: 85})
  t.deepEqual(v.world.bound.toJSON(), {x: 120, y: 115})
  
  t.end()
})
