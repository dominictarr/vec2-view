var h = require('hyperscript')
var Vec2 = require('vec2')
var View = require('../')
var canvas = h('canvas')
var ctx = canvas.getContext('2d')

//create a canvas that is the full size of the window
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)

//create a vec2-view instance, and track the canvas
var view = new View()

//seting the zoom or the center point moves the view over
//the underlying coordinates.
view.zoom(1)
view.center.set(-150, -150)

//register touch/mouse/key listeners and move automatically
view.track(canvas)

//when the view is moved, redraw everything
update()
view.change(update)

function update () {
  //draw everything...
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = 'black'
  var v = view.toView(new Vec2(-100, -100))
  var v2 = view.toView(new Vec2(100, 100))
  var center = view.toView(new Vec2(0, 0))

  ctx.beginPath()
  ctx.moveTo(v.x, v.y)
  ctx.lineTo(v2.x, v2.y)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(v2.x, v.y)
  ctx.lineTo(v.x, v2.y)
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(center.x, center.y, view.toView(100), 0, Math.PI*2, true)
  ctx.stroke()
}

