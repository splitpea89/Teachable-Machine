// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using a pre-trained customized model and p5.js
This example uses p5 preload function to create the classifier
=== */

// Classifier Variable
let classifier;
// Model URL
const URL = "https://teachablemachine.withgoogle.com/models/eCvbR9hvI/";
let model, ctx, labelContainer;

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";

let poseNet;
let poses = [];

class GridPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  getScreenX() {
    return(this.x*50 + 25);
  }
  getScreenY() {
    return(this.y*50 + 25);
  }
}

class SnakeSegment {
  constructor(pos, isHead) {
    this.pos = pos;
    this.isHead = isHead;
  }
  moveTo(segment) {
    this.pos.x = segment.pos.x;
    this.pos.y = segment.pos.y;
  }
}

let snakeList = [new SnakeSegment(new GridPoint(5, 5), true)];
let applePos = new GridPoint(5,2);
let direction = 0; // 0 up, 1 right, 2 down, 3 left

let gameStarted = false;
let t = 0;
let lastX;
let lastY;

let screenUpdateMs = 400;

function drawBackground() {
  let darkSquare = false;
  for(let i = 0; i <= 10; i++) {
    for(let j = 0; j <= 10; j++) {
      if(darkSquare) {
        fill(30, 140, 0);
        darkSquare = false;
      } else {
        fill(70, 200, 0);
        darkSquare = true;
      }
      rect(50 * j + 25, 50 * i + 25, 50, 50);
    }
  }
}

function spawnApple() {
  applePos = randomEmptySquare();
}

function resetGame() {
  gameStarted = false;
  snakeList = [new SnakeSegment(new GridPoint(5, 5), true)];
  applePos = new GridPoint(5, 2);
}

function randomEmptySquare() {

  let possibleSquares = [];

  for(let i = 0; i < 10; i++) {
    for(let j = 0; j < 10; j++) {

      for(let i = 0; i < snakeList.length; i++) {
        let segment = snakeList[i]

        if(segment.pos.x == i && segment.pos.y == j) {
          continue;
        }
      }

      append(possibleSquares, new GridPoint(i, j));
    }
  }


  let randIndex = int(Math.round((Math.random() * (possibleSquares.length - 1))));

  return(possibleSquares[randIndex]);

}

function gameOver() {

  gameStarted = false;
  fill(255, 255, 255);
  rect(250, 250, 160, 75);
  fill(0, 0, 0);
  text("Game Over!", 250, 250, 125, 75);

}

function checkValidSquare(x, y) {

  for(let i = 0; i < snakeList.length; i++) {
    let segment = snakeList[i]
    if(x == segment.pos.x && y == segment.pos.y) {
      if(snakeList.indexOf(segment) != snakeList.length - 1) {
        return(false);
      }
    }
  }

  if(x<0 || x>10) {
    return(false);
  }

  if(y<0 || y>10) {
    return(false);
  }

  return(true);

}

function win() {

  gameStarted = false;
  fill(255, 255, 255);
  rect(250, 250, 160, 75);
  fill(0, 200, 50);
  text("You Won!!", 250, 250, 125, 75);

}

function mousePressed() {
  if (!gameStarted) {
    resetGame();
    gameStarted = true;
  }
}

// Load the model first
async function load() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  model = await tmPose.load(modelURL, metadataURL);
  poseNet = ml5.poseNet(video);
  await poseNet.on('pose', gotPoses);
}

async function setup() {
  createCanvas(550, 800);
  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video)

  // const modelURL = URL + "model.json";
  // const metadataURL = URL + "metadata.json";
  // model = await tmPose.load(modelURL, metadataURL);
  console.log(model);

  noStroke();
  rectMode(CENTER);
  textSize(20);
  textAlign(CENTER, CENTER);

  drawBackground();

  t = millis();
}

function draw() {
  // TODO: Main Game Loop

  image(video, 120, 575);

  fill(255);
  textSize(25);
  textAlign(CENTER);
  text(label, width / 2, height - 10);

  let ms = millis();

  if(snakeList.length > 80) {
    win();
  }

  predict();

  if(label == "Up" && direction != 2) {
    direction = 0;
  } else if(label == "Right" && direction != 3) {
    direction = 1;
  } else if(label == "Down" && direction != 0) {
    direction = 2;
  } else if(label == "Left" && direction != 1) {
    direction = 3;
  }

  if(gameStarted) {

    if(ms - t > screenUpdateMs) {

      drawBackground();

      t = millis();

      lastX = snakeList[snakeList.length - 1].pos.x;
      lastY = snakeList[snakeList.length - 1].pos.y;

      if(direction == 0) {
        if(!checkValidSquare(snakeList[0].pos.x, snakeList[0].pos.y - 1)) {
          gameOver();
        }
      } else if(direction == 1) {
        if(!checkValidSquare(snakeList[0].pos.x + 1, snakeList[0].pos.y)) {
          gameOver();
        }
      } else if(direction == 2) {
        if(!checkValidSquare(snakeList[0].pos.x, snakeList[0].pos.y + 1)) {
          gameOver();
        }
      } else if(direction == 3) {
        if(!checkValidSquare(snakeList[0].pos.x - 1, snakeList[0].pos.y)) {
          gameOver();
        }
      }

      if(gameStarted) {

        for(let i = snakeList.length - 1; i > 0; i--) {
          snakeList[i].moveTo(snakeList[i-1]);
        }


        if(direction == 0) {
          snakeList[0].pos.y -= 1;
        } else if(direction == 1) {
          snakeList[0].pos.x += 1;
        } else if(direction == 2) {
          snakeList[0].pos.y += 1;
        } else if(direction == 3) {
          snakeList[0].pos.x -= 1;
        }

      }

      if(snakeList[0].pos.x == applePos.x && snakeList[0].pos.y == applePos.y) {

        spawnApple();
        let newSegment = new SnakeSegment(new GridPoint(lastX, lastY), false);
        append(snakeList, newSegment);

      }

    }

  }

  let segmentSize;

  for(let i = 0; i < snakeList.length; i++) {

     let segment = snakeList[i];

     if(segment.isHead) {
       fill(100, 100, 255);
       segmentSize = 45;
     } else if(snakeList.indexOf(segment) % 2 == 0) {
       fill(140, 150, 140);
       segmentSize = 35;
     } else {
       fill(150, 140, 150);
       segmentSize = 40;
     }

     rect(segment.pos.getScreenX(), segment.pos.getScreenY(), segmentSize, segmentSize);

   }

   fill(255, 0, 0);
   ellipse(applePos.getScreenX(), applePos.getScreenY(), 40, 40);
}

// Get a prediction for the current video frame


//--------------------------------------------------------------------------------------//

      function predict() {
        // Prediction #1: run input through posenet
        // estimatePose can take in an image, video or canvas html element

          const {pose, posenetOutput} = model.estimatePose(flippedVideo);
          // Prediction 2: run input through teachable machine classification model
          const prediction = model.predict(posenetOutput);

          for (let i = 0; i < 4; i++) { // 4 is number of categories in model
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            console.log(classPrediction);
          }

          if (prediction[0].className === "Up") {
            direction = 0;
          } else if (prediction[0].className === "Right") {
            direction = 1;
          } else if (prediction[0].className === "Down") {
            direction = 2;
          } else if (prediction[0].className === "Left") {
            direction = 3;
          }
    }

    function gotPoses(results) {
      poses = results;
    }