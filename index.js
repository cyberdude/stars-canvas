var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var stars = [], // Array that contains the stars
    FPS = 24, // Frames per second
    x = 80; // Number of stars

// Push stars to array

for (var i = 0; i < x; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random(),
    vx: Math.floor(Math.random() * 10) - 5,
    vy: Math.floor(Math.random() * 10) - 5
  });
}

// Draw the scene

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  
  // ctx.globalCompositeOperation = "lighter";
  
  for (var i = 0, x = stars.length; i < x; i++) {
    var s = stars[i];
  
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

// Update star locations

function update() {
  for (var i = 0, x = stars.length; i < x; i++) {
    var s = stars[i];
  
    s.x += s.vx / FPS;
    s.y += s.vy / FPS;
    
    if (s.x < 0 || s.x > canvas.width) s.x = -s.x;
    if (s.y < 0 || s.y > canvas.height) s.y = -s.y;
  }
}

// Update and draw

function tick() {
  draw();
  update();
  requestAnimationFrame(tick);
}

tick();


;(function() {
  ShootingStar = function(id) {
    this.n = 0;
    this.m = 0;
    this.defaultOptions = {
      velocity: 8,
      starSize: 10,
      life: 300,
      beamSize: 400,
      dir: -1
    };
    this.options = {};
    id = (typeof id != "undefined") ? id : "";
    this.capa = ($(id).lenght > 0) ? "body" : id;
    this.wW = $(this.capa).innerWidth();
    this.hW = $(this.capa).innerHeight();
  };

  ShootingStar.prototype.addBeamPart = function(x, y) {
    this.n++;
    var name = this.getRandom(100, 1);
    $("#star" + name).remove();
    $(this.capa).append("<div id='star" + name + "'></div>");
    $("#star" + name).append("<div id='haz" + this.n + "' class='haz' style='position:absolute; color:#FF0; width:10px; height:10px; font-weight:bold; font-size:" + this.options.starSize + "px'>·</div>");
    if (this.n > 1) $("#haz" + (this.n - 1)).css({
      color: "rgba(255,255,255,0.5)"
    });
    $("#haz" + this.n).css({
      top: y + this.n,
      left: x + (this.n * this.options.dir)
    });
  }

  ShootingStar.prototype.delTrozoHaz = function() {
    this.m++;
    $("#haz" + this.m).animate({
      opacity: 0
    }, 75);
  }

  ShootingStar.prototype.getRandom = function(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  ShootingStar.prototype.toType = function(obj) {
    if (typeof obj === "undefined") {
      return "undefined"; /* consider: typeof null === object */
    }
    if (obj === null) {
      return "null";
    }
    var type = Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1] || '';
    switch (type) {
      case 'Number':
        if (isNaN(obj)) {
          return "nan";
        } else {
          return "number";
        }
      case 'String':
      case 'Boolean':
      case 'Array':
      case 'Date':
      case 'RegExp':
      case 'Function':
        return type.toLowerCase();
    }
    if (typeof obj === "object") {
      return "object";
    }
    return undefined;
  }

  ShootingStar.prototype.launchStar = function(options) {
    if (this.toType(options) != "object") {
      options = {};
    }
    this.options = $.extend({}, this.defaultOptions, options);
    this.n = 0;
    this.m = 0;
    var i = 0,
      l = this.options.beamSize,
      x = this.getRandom(this.wW - this.options.beamSize - 100, 100),
      y = this.getRandom(this.hW - this.options.beamSize - 100, 100),
      self = this;
    for (; i < l; i++) {
      setTimeout(function() {
        self.addBeamPart(x, y);
      }, self.options.life + (i * self.options.velocity));
    }
    for (i = 0; i < l; i++) {
      setTimeout(function() {
        self.delTrozoHaz()
      }, self.options.beamSize + (i * self.options.velocity));
    }
  }

  ShootingStar.prototype.launch = function(everyTime) {
    if (this.toType(everyTime) != "number") {
      everyTime = 10;
    }
    everyTime = everyTime * 1000;
    this.launchStar();
    var self = this;
    setInterval(function() {
      var options = {
        dir: (self.getRandom(1, 0)) ? 1 : -1,
        life: self.getRandom(400, 100),
        beamSize: self.getRandom(700, 400),
        velocity: self.getRandom(10, 4)
      }
      self.launchStar(options);
    }, everyTime);
  }

})();

$(document).ready(function() {
  var shootingStarObj = new ShootingStar("body");
  shootingStarObj.launch(45);
});