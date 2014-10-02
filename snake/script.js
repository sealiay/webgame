
(function () {

  var ctx = canvas.getContext("2d");

  var pix = 23, edge = 13;
  var block = edge * edge;
  var border = 5;
  var size = edge * pix + 2 + border * 2;
  var bgcolor = "#9eac88", fgcolor = "#869375";
  var message = '<div style="padding-top: 105px">' +
    '您的长度是<span style="color: red"> %l </span>厘米<br>' +
    '击败了全国<span style="color: green"> %p% </span>的人<br>' +
    '获得称号 "%s"</div>';

  canvas.width = size;
  canvas.height = size;

  function draw(pt, fg) {
    var x = pt.x * pix + border + 2, y = pt.y * pix + border + 2;
    var o = 2;
    var i = 2;
    ctx.fillStyle = fg;
    ctx.fillRect(x, y, pix-o, pix-o);
    ctx.lineWidth = o;
    ctx.strokeStyle = bgcolor;
    ctx.strokeRect(x+i, y+i, pix-o-2*i, pix-o-2*i);
  }
  function pt2idx(pt) { return pt.x * edge + pt.y; }
  function idx2pt(i) { return {x: Math.floor(i/edge), y: i%edge}; }


  function Game() {
    var game = this;
    var snake = new Queue(block + 5);
    var taken = new Array(block);
    var dirs = new Queue();
    var length = 5;
    var time = 200;

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

      if ( pt.x < 0 || pt.x >= edge ) return death();
      if ( pt.y < 0 || pt.y >= edge ) return death();

      if ( snake.size() >= length ) pop_tail();
      if ( taken[pt2idx(pt)] ) return death();
      new_head(pt);

      if ( pt2idx(pt) != apple ) return;
      length += Math.max(1, Math.floor(Math.log(length)) - 1);
      do {
        apple = Math.floor(Math.random() * block);
      } while ( taken[apple] );
      draw(idx2pt(apple), "#000");

      if ( time < 100 ) return;
      time -= 10;
      clearInterval(interval);
      interval = setInterval(loop, time);
    }

    function death() {
      clearInterval(interval);
      var len = snake.size(), str = message;
      str = str.replace("%l", len);
      str = str.replace("%p", Math.min(99, Math.floor(Math.log(Math.max(len, 5) - 4)/0.028)));
      if (len <= 6)
        str = str.replace("%s", "人穷智短");
      else if (len <= 8)
        str = str.replace("%s", "笨手笨脚");
      else if (len <= 11)
        str = str.replace("%s", "将勤补拙");
      else if (len <= 15)
        str = str.replace("%s", "冰雪聪明");
      else if (len <= 19)
        str = str.replace("%s", "眼捷手快");
      else if (len <= 23)
        str = str.replace("%s", "势如破竹");
      else
        str = str.replace("%s", "风驰电掣");
      web.apply("message", str);
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
  web.apply("share", "测测好友的长度吧！");

  web.Game = Game;
})();

