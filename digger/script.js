
(function () {

  var ctx = canvas.getContext("2d");

  var hcount = 4, vcount = 4, count = hcount * vcount;
  var pix = Math.floor(300 / hcount);
  var border = 5;
  var hsize = hcount * pix + 2 + border * 2;
  var vsize = vcount * pix + 2 + border * 2 + 60;
  var image = new Image();
  image.src = "/images/cards.jpg";

  var bgcolor = "#9eac88", fgcolor = "#869375";
  var message = '<div style="padding-top: 105px">' +
    '您的长度是<span style="color: red"> %l </span>厘米<br>' +
    '击败了全国<span style="color: green"> %p% </span>的人<br>' +
    '获得称号 "%s"</div>';
  var title = "复古贪吃蛇 | 我的蛇长度%l，击败全国%p%的人，你呢？";

  canvas.width = hsize;
  canvas.height = vsize;

  function draw(pt, fg, id) {
    var x = pt.x * pix + border + 2, y = pt.y * pix + border + 2 + 60;
    var o = 3;
    var i = 4;
    ctx.fillStyle = fg;
    ctx.fillRect(x, y, pix-o, pix-o);
    ctx.lineWidth = i;
    ctx.strokeStyle = bgcolor;
    ctx.strokeRect(x+i, y+i, pix-o-2*i, pix-o-2*i);
    if ( id != undefined) {
      var s = 52;
      ctx.drawImage(image, id%7*s+1, Math.floor(id/7)*s+1, s-2, s-2, x+i*1.5, y+i*1.5, pix-o-3*i, pix-o-3*i);
    }
  }
  function pt2idx(pt) { return pt.x * vcount + pt.y; }
  function idx2pt(i) { return {x: Math.floor(i/vcount), y: i%vcount}; }

  function Game() {
    var cards = [];
    var maxlife = 30, life = maxlife + 1;
    var interval;
    var game = this;
    var previous = null, process = false;
    var left = count;

    function tick() {
      --life;
      var x = 80, y = 35, w = 200, h = 20;
      ctx.fillStyle = bgcolor;
      ctx.fillRect(x, y-25, w, h);
      ctx.font="16px microsoft yahei";
      ctx.fillStyle = "#000";
      ctx.fillText("剩余挖掘时间： " + life, x, y-8);
      ctx.strokeStyle = fgcolor;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = fgcolor;
      var s = 3;
      ctx.fillRect(x+s, y+s, w-2*s, h-2*s);
      ctx.fillStyle = "#000";
      ctx.fillRect(x+s, y+s, (w-2*s)*life/maxlife, h-2*s);
      if ( life == 0 ) return death();
    }

    this.start = function () {
      this.init();
      interval = setInterval(tick, 1000);
      for (var i = 0; i < count; i += 2) {
        cards.push({}, {});
        cards[i].id = cards[i+1].id = Math.floor(Math.random() * 49);
      }
      for (var i = count-1; i >= 0; --i) {
        var j = Math.floor(Math.random() * i);
        var t = cards[i];
        cards[i] = cards[j];
        cards[j] = t;
        cards[i].pos = idx2pt(i);
        cards[i].side = "back";
      }
    };

    function death() {
      clearInterval(interval);
      if ( left > 0 ) {
        web.apply("message", '<div style="padding-top: 105px">不好意思<br>没有在光荣榜上看到你！<br>是我打开的方式不对吗？</div>');
        web.apply("title", "挖掘技术考试 | 我没有挖到所有的宝贝，要不你来试试？", "root");
      } else {
        var message = '<div style="padding-top: 105px">' + 
          '你用<span style="color: red">%t</span>秒通过考试<br>' + 
          '击败了全国 <span style="color: green">%p%</span> 的人<br>获得称号 "%s"</div>';
        var title = '挖掘技术考试 | 我用%t秒通过考试，获得称号%s';
        message = message.replace("%t", maxlife - life);
        title = title.replace("%t", maxlife - life);
        web.apply("message", message);
        web.apply("title", title, "root");
      }
      web.death();
    }

    function turn(card) {
      if ( card.side == "front" ) {
        draw(card.pos, fgcolor);
        card.side = "back";
      } else {
        draw(card.pos, fgcolor, card.id);
        card.side = "front";
      }
    }

    function blink(c1, c2, cnt) {
      var s = 100;
      function doit() {
        turn(c1);
        turn(c2);
        if ( cnt == 0 ) {
          previous = null;
          process = false;
        } else {
          setTimeout(doit, s + s*(cnt%2));
          --cnt;
        }
      }
      setTimeout(doit, s+s);
    }

    function handle(x, y) {
      if ( process ) return;
      x = Math.floor(Math.round(x - 7 ) / pix);
      y = Math.floor(Math.round(y - 72) / pix);
      var i = pt2idx({x: x, y: y});
      var card = cards[i];
      if ( card.side != "back" ) return;
      turn(card);

      if ( previous == null ) {
        previous = card;
        return;
      }
      if ( previous.id == card.id ) {
        left -= 2;
        previous = null;
        if ( left == 0 ) death();
        return;
      }
      process = true;
      blink(card, previous, 4);
    }

    this.events = new Events({onclick: handle});

    this.init = function() {
      ctx.fillStyle = bgcolor;
      ctx.fillRect(0, 0, hsize, vsize);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 10;
      ctx.strokeRect(0, 0, hsize, vsize);
      for (var i = 0; i < count; ++i)
        draw(idx2pt(i), fgcolor);
      tick();
    };
  };

  new Game().init();

  web.apply("title", "挖掘技术考试", "root");
  web.apply("icon", "/images/icon.jpg", "root");
  web.apply("image", {
    start : "/images/start.png",
    replay: "/images/replay.png",
    share : "/images/share.png",
  });
  web.apply("share", "测测好友的挖掘技术吧！");

  web.Game = Game;

})();

