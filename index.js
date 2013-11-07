//var touches = require('vec2-touch')
var o       = require('observable')
var Vec2    = require('vec2')

var movement = require('./movement')

//Aha, a vector layer just manages tiles...
//you can change: it's dimensions, size, and zoom.

module.exports = View
  
function View () {
  if(!(this instanceof View)) return new View()
  //absolute center. move this to view another part of the graph
  this.center = new Vec2()
  //conversion between model units and screen units.
  //it is up to the user to select a sensible defaut for the zoom settings.
  this.zoom = o()
  this.zoom(1)
  this.listeners = []
  //the size of the view, from top-left to bottom-right
  //this is set to the size of the canvas (for example)
  var view = this.view = new Vec2()
  
  var vc = this._viewCenter = new Vec2()
  var self = this
  function update () {
    self._viewCenter.set(self.view.x / 2, self.view.y / 2)
    self.listeners.forEach(function (l) { l() })
  }
  this.center.change(update)
  this.zoom(update)
  this.view.change(update)
}

var proto = View.prototype
proto.toModel = function (v, immutable) {
  //handle scalars also.
  if('number' === typeof v)
    return v / this.zoom()
  return this.view.divide(2, true).subtract(v).multiply(this.zoom())
}

proto.toView = function (v) {
  //handle scalars also
  if('number' === typeof v)
    return v * this.zoom()

  var _v = v
    .subtract(this.center, true)
    .multiply(this.zoom())
    .add(this._viewCenter)
  return _v
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
  movement(this, canvas, opts)
  return this
}
