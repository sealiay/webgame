
(function () {

  var ctx = canvas.getContext("2d");

  var pix = 23, edge = 13;
  var block = edge * edge;
  var border = 5;
  var time = 100;
  var size = edge * pix + 2 + border * 2;
  var bgcolor = "#9eac88", fgcolor = "#869375";

  canvas.width = size;
  canvas.height = size;

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


  function Game() {
    var game = this;
    var snake = new Queue(block + 5);
    var taken = new Array(block);
    var dirs = new Queue();
    var length = 5;

    var direct = DRC.r;
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
      web.apply("message", "<p>length: " + snake.size() + "</p>");
      web.death();
    }

    function handler(d) { dirs.enque(d); }

    this.events = new Events({onkey: handler, ontouch: handler});

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
      this.init();
      for (var i = 0; i < block; ++i)
        draw(idx2pt(i), fgcolor);
      new_head({x: 1, y: 1});
      draw(idx2pt(apple), "#000");

      interval = setInterval(loop, time);
    };
  };

  new Game().init();

  web.apply("image", {
    start : "/images/start.png",
    replay: "/images/replay.png",
    share : "/images/share.png",
  });

  web.Game = Game;
})();

