//var touches = require('vec2-touch')
var o       = require('observable')
var Vec2    = require('vec2')
var Rec2    = require('rec2')

var movement = require('./movement')

//Aha, a vector layer just manages tiles...
//you can change: it's dimensions, size, and zoom.

function isFunction (f) {
  return 'function' === typeof f
}

module.exports = View
  
function View (scale) {
  if(!(this instanceof View)) return new View(scale)
  //absolute center. move this to view another part of the graph
  this.center = new Vec2()
  //conversion between model units and screen units.
  //it is up to the user to select a sensible defaut for the zoom settings.
  this.zoom = new Vec2().set(1, 1)

  this.scale = scale || 1
  this.listeners = []
  //the size of the view, from top-left to bottom-right
  //this is set to the size of the canvas (for example)

  var view = this.view = new Vec2()
  var world = this.world = new Rec2()
  var worldMax = this.worldMax = this.world.bound
  var self = this

  function update () {
    var hx = self.view.x / 2, hy = self.view.y / 2
    var ix = 1/self.zoom.x, iy = 1/self.zoom.y

    self.world.set(
      self.center.x - hx*ix,
      self.center.y - hy*iy
    )

    self.worldMax.set(
      self.world.x + self.view.x * ix,
      self.world.y + self.view.y * iy
    )

    self.listeners.forEach(function (l) { l() })
  }

  this.center.change(update)
  this.zoom.change(update)
  this.view.change(update)
}

function divide (v, u) {
  v.set(v.x / u.x, v.y / u.y)
  return v
}

var proto = View.prototype
proto.toModel = function (v, u) {
  u = u || new Vec2()
  return u.set((this.screen.x - v.x) * (1/this.zoom.x), (this.screen.y - v.y) * (1/this.zoom.y))
}

proto.toView = function (v, u) {
  //handle scalars also
  if('number' === typeof v)
    return v * (this.zoom.x + this.zoom.y)/2
  u = u || new Vec2()

  return u.set(
    (v.x - this.center.x) * this.zoom.x + this.view.x*0.5,
    (v.y - this.center.y) * this.zoom.y + this.view.y*0.5
  )
}

proto.change = function (listener) {
  this.listeners = this.listeners || []
  this.listeners.push(listener)
  return this 
}

proto.ignore = function (listener) {
  var i = this.listeners.indexOf(listener)
  if(~i) this.listeners.splice(i, 1)
  return !!~i
}

proto.track = function (canvas, opts) {
  var self = this
  if(canvas.center && isFunction(canvas._zoom)) {
    canvas.change(function () {
      self.center.set(canvas.center)
      self._zoom(canvas._zoom() * self.scale)
      self.view.set(canvas.view)
    })
  } else
    movement(this, canvas, opts)
  return this
}
