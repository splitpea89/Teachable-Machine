// To play: click to spawn a ball. Use the arrow keys to control gravity.

var balls = [];
var ballSize = 50;
var gravity = 1;
var gravityDir = 0;
var size = 750
// 0 - 3, down, right, up, left

function setup() {
  createCanvas(size, size);
}

function draw() {
  background(220);

  // Effect of Gravity
  if(gravityDir == 0) {
    for(var i = 0; i < balls.length; i += 1) {
      if(!(abs(balls[i].vel.y) <= 3 && balls[i].pos.y >= size - (balls[i].size/2))) {
        balls[i].vel.y += gravity;
      } else {
        balls[i].vel.y = 0;
      }
    }
  } else if(gravityDir == 1) {
    for(var i = 0; i < balls.length; i += 1) {
      if(!(abs(balls[i].vel.x) <= 3 && balls[i].pos.x >= size - (balls[i].size/2))) {
        balls[i].vel.x += gravity;
      } else {
        balls[i].vel.x = 0;
      }
    }
  } else if(gravityDir == 2) {
    for(var i = 0; i < balls.length; i += 1) {
      if(!(abs(balls[i].vel.y) <= 3 && balls[i].pos.y <= 0 + (balls[i].size/2))) {
        balls[i].vel.y -= gravity;
      } else {
        balls[i].vel.y = 0;
      }
    }
  } else if(gravityDir == 3) {
    for(var i = 0; i < balls.length; i += 1) {
      if(!(abs(balls[i].vel.x) <= 3 && balls[i].pos.x <= 0 + (balls[i].size/2))) {
        balls[i].vel.x -= gravity;
      } else {
        balls[i].vel.x = 0;
      }
    }
  }

  // Move Balls
  for(var i = 0; i < balls.length; i += 1) {
    balls[i].pos.x += balls[i].vel.x;
    balls[i].pos.y += balls[i].vel.y;
  }

  // Check Floor/Ceiling Collision
  for(var i = 0; i < balls.length; i += 1) {
    if(abs(balls[i].pos.y - (size/2)) >= (size/2) - (balls[i].size/2)) {
      // Handle Collision (bounce)
      if(abs(balls[i].vel.y) > 0) {
        balls[i].vel.y *= -0.9;
      }
    }
  }

  // Check Wall Collision
  for(var i = 0; i < balls.length; i += 1) {
    if(abs(balls[i].pos.x - (size/2)) >= (size/2) - (balls[i].size/2)) {
      balls[i].vel.x *= -0.9;
    }
  }

  // Keep Balls In Bounds
  for(var i = 0; i < balls.length; i += 1) {
    if(balls[i].pos.x < 0 + (balls[i].size/2)) {
      balls[i].pos.x = 0 + (balls[i].size/2);
    } else if(balls[i].pos.x > size - (balls[i].size/2)) {
      balls[i].pos.x = size - (balls[i].size/2);
    }

    if(balls[i].pos.y < 0 + (balls[i].size/2)) {
      balls[i].pos.y = 0 + (balls[i].size/2);
    } else if(balls[i].pos.y > size - (balls[i].size/2)) {
      balls[i].pos.y = size - (balls[i].size/2);
    }
  }

  // Draw Balls
  for(var i = 0; i < balls.length; i += 1) {
    ellipse(balls[i].pos.x, balls[i].pos.y, ballSize, ballSize);
  }

  // Air Resistance
  for(var i = 0; i < balls.length; i += 1) {
    balls[i].vel.y *= 0.99;
    balls[i].vel.x *= 0.99;
  }

}

function mouseClicked() {
  balls.push(new Ball(new Point(mouseX, mouseY), new Velocity(random(-4, 4), random(-4, 4)), ballSize));
}

function keyPressed() {
  if(keyCode == LEFT_ARROW) {
    gravityDir = 3;
  } else if(keyCode == DOWN_ARROW) {
    gravityDir = 0;
  } else if(keyCode == RIGHT_ARROW) {
    gravityDir = 1;
  } else if(keyCode == UP_ARROW) {
    gravityDir = 2;
  }
}

class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

}

class Velocity {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

}

class Ball {

  constructor(pos, vel, size) {
    this.pos = pos;
    this.vel = vel;
    this.size = size;
  }

}