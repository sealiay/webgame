
function Queue() {
  var array = [,,,,,,,];
  var begin = 0, size = 0;

  function get(i) { return array[(begin + i) % array.length]; }

  this.enque = function (val) {
    if ( size == array.length ) {
      var next = [];
      for (var i = 0; i < size; ++i)
        next.push(get(i));
      for (var i = 0; i < size; ++i)
        next.push(undefined);
      array = next;
      begin = 0;
    }
    array[(begin + size++) % array.length] = val;
    return this;
  }

  this.deque = function () {
    var r = array[begin++];
    begin %= array.length;
    --size;
    return r;
  }

  this.head = function () { return get(0); }
  this.tail = function () { return get(size-1); }
  this.size = function () { return size; }
}

var DRC = {
  l: {x: -1, y:  0},
  r: {x:  1, y:  0},
  u: {x:  0, y: -1},
  d: {x:  0, y:  1},
};

function Events(events) {
  var body = $(document.body);
  var touch;

  function onkeydown(e) {
    var handle = events.onkey;
    switch ( e.keyCode ) {
    case 37: handle(DRC.l); break;
    case 38: handle(DRC.u); break;
    case 39: handle(DRC.r); break;
    case 40: handle(DRC.d); break;
    }
  }

  function getxy(e) {
    if ( e.pageX == undefined ) {
      e = e.originalEvent.changedTouches[0];
    }
    return {x: e.pageX, y: e.pageY};
  }
  function ontouchstart(e) {
    touch = getxy(e);
  }
  function ontouchend(e) {
    var handle = events.ontouch;
    var n = getxy(e);
    var x = n.x - touch.x, y = n.y - touch.y;
         if ( y >= -x && y <  x ) handle(DRC.r);
    else if ( y >=  x && y > -x ) handle(DRC.d);
    else if ( y <= -x && y >  x ) handle(DRC.l);
    else if ( y <=  x && y < -x ) handle(DRC.u);
  }

  this.on = function () {
    if ( events.onkey ) {
      body.on("keydown", onkeydown);
    }
    if ( events.ontouch ) {
      body.on("mousedown touchstart", ontouchstart);
      body.on("mouseup touchend", ontouchend);
    }
  }

  this.off = function () {
    if ( events.onkey ) {
      body.off("keydown", onkeydown);
    }
    if ( events.ontouch ) {
      body.off("mousedown touchstart", ontouchstart);
      body.off("mouseup touchend", ontouchend);
    }
  }
}

