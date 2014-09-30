
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
};


$(function () {

  var ctx = canvas.getContext("2d");

  var pix = 23, edge = 13;
  var block = edge * edge;
  var border = 5;
  var time = 100;
  var size = edge * pix + 2 + border * 2;
  var directions = {
    l: {x: -1, y:  0},
    r: {x:  1, y:  0},
    u: {x:  0, y: -1},
    d: {x:  0, y:  1},
  };
  var bgcolor = "#9eac88", fgcolor = "#869375";

  function draw(pt, fg) {
    var x = pt.x * pix + border + 2, y = pt.y * pix + border + 2;
    ctx.fillStyle = fg;
    ctx.fillRect(x, y, pix-3, pix-3);
    ctx.lineWidth = 3;
    ctx.strokeStyle = bgcolor;
    ctx.strokeRect(x+5, y+5, pix-13, pix-13);
  }
  function pt2idx(pt) { return pt.x * edge + pt.y; }
  function idx2pt(i) { return {x: Math.floor(i/edge), y: i%edge}; }

  canvas.width = size;
  canvas.height = size;

  function Game() {
    var game = this;
    var snake = new Queue(block + 5);
    var taken = new Array(block);
    var dirs = new Queue();
    var length = 5;

    var direct = directions.r;
    var apple = Math.floor(block / 2);
    var interval;

    function new_head(pt) {
      snake.enque(pt);
      taken[pt2idx(pt)] = true;
      draw(pt, "#000");
    }

    function pop_tail() {
      var pt = snake.deque();
      taken[pt2idx(pt)] = false;
      draw(pt, fgcolor);
    }

    function getdir() {
      while ( dirs.size() > 0 ) {
        var d = dirs.deque();
        if ( d.x * direct.x + d.y * direct.y == 0 )
          return direct = d;
      }
      return direct;
    }

    function loop() {
      var pt = snake.tail(); // snake head is queue tail
      var d = getdir();
      pt = {x: pt.x + d.x, y: pt.y + d.y};

      if ( pt.x < 0 || pt.x >= edge ) return death(0);
      if ( pt.y < 0 || pt.y >= edge ) return death(0);

      if ( snake.size() >= length ) pop_tail();
      if ( taken[pt2idx(pt)] ) return death(1);
      new_head(pt);

      if ( pt2idx(pt) == apple ) {
        length += Math.max(1, Math.floor(Math.log(length)) - 1);
        do {
          apple = Math.floor(Math.random() * block);
        } while ( taken[apple] );
        draw(idx2pt(apple), "#000");
      }
    }

    function death() {
      interval = clearInterval(interval);
      game.death(snake.size());
    }

    this.init = function() {
      ctx.fillStyle = bgcolor;
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 10;
      ctx.strokeRect(0, 0, size, size);
      for (var i = 0; i < block; ++i)
        draw(idx2pt(i), fgcolor);
    };

    this.start = function() {
      for (var i = 0; i < block; ++i)
        draw(idx2pt(i), fgcolor);
      new_head({x: 1, y: 1});
      draw(idx2pt(apple), "#000");

      $("body").keydown =
      interval = setInterval(loop, time);
    };

    this.operate = function(dir) {
      dirs.enque(dir);
    };
  };

  var game = new Game();
  game.init();

  function onkeydown(e) {
    switch ( e.keyCode ) {
    case 37: game.operate(directions.l); break;
    case 38: game.operate(directions.u); break;
    case 39: game.operate(directions.r); break;
    case 40: game.operate(directions.d); break;
    }
  }

  function getxy(e) {
    if ( e.pageX == undefined ) {
      e = e.originalEvent.changedTouches[0];
    }
    return {x: e.pageX, y: e.pageY};
  }

  var touch;
  function ontouchstart(e) {
    touch = getxy(e);
  }

  function ontouchend(e) {
    var n = getxy(e);
    var x = n.x - touch.x, y = n.y - touch.y;
         if ( y >= -x && y <  x ) game.operate(directions.r);
    else if ( y >=  x && y > -x ) game.operate(directions.d);
    else if ( y <= -x && y >  x ) game.operate(directions.l);
    else if ( y <=  x && y < -x ) game.operate(directions.u);
  }

  function start() {
    $(".popup").hide();
    game = new Game();
    game.init();
    game.start();
    game.death = death;

    var body = $(document.body);
    body.on("keydown", onkeydown);
    body.on("mousedown touchstart", ontouchstart);
    body.on("mouseup touchend", ontouchend);
  }

  function death(len) {
    var body = $(document.body);
    body.off("keydown", onkeydown);
    body.off("mousedown touchstart", ontouchstart);
    body.off("mouseup touchend", ontouchend);
    $("#death").show().find(".text").text("length: " + len);
  }

  $(document.body).on("touchmove", function (e) { e.preventDefault(); });

  $(".game").click(function() {
    start();
  });

});
