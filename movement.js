var Vec2 = require('vec2')
var Touch = require('vec2-touch')

function isNumber(n) {
  return 'number' === typeof n
}

function isFunction (f) {
  return 'function' === typeof f
}

module.exports = function (view, canvas, opts) {

  //the example is with a canvas,
  //but this will work the same with
  //dom or svg whatever

  var rect = isFunction(canvas.getBoundingClientRect)
    ? canvas.getBoundingClientRect()
    : rect

  if(isNumber(rect.width) && isNumber(rect.height))
    view.view.set(rect.width, rect.height)
  Touch(canvas, function (t) {
    t.event.preventDefault()
    var _t = t.clone()
    var diff = _t.clone()
    t.change(function () {
      //if you hold the shift key and drag, zoom instead of moving.
      diff.set(_t).subtract(t).multiply(1/view.zoom())

      if(t.event.shiftKey) {
        var z = _t.y - t.y
        view.zoom(view.zoom() * (100 + z) / 100)
      } else {
        view.center.add(diff)
      }

      _t.set(t)
    })
  }, {})


  var keys = {
    '39': 'right',
    '37': 'left',
    '38': 'up',
    '40': 'down',
    '187': '+',
    '189': '-'
  }

  window.addEventListener('keydown', function (e) {
    var motion = keys[e.keyCode]
    if(!motion) return

    var v = new Vec2()

    if('+' === motion || '-' === motion)
      return view.zoom(view.zoom() * (motion === '+' ? 1.25 : 0.8))

    if('right' === motion) v.set(-1,  0)
    if('left'  === motion) v.set( 1,  0)
    if('up'    === motion) v.set( 0,  1)
    if('down'  === motion) v.set( 0, -1)

    v.divide(view.zoom()).multiply(20)
    e.preventDefault()
    view.center.add(v)
  })

}
