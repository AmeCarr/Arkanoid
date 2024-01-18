var lastUpdateTime = (new Date).getTime();
var currentTime;
var deltaTime;

var maxNumBricks = 0;
var currentNumBricks = 0;

//objects
var ball = null;
var paddle = null;
var wallLeft = null;
var wallRight = null;
var wallUp = null;

var bricksList = [];
var wallsList = [];

//objects list
var objectsList = [];

//mouse variables
var lastMouseX = -100;
var lastMouseY = -100;
var mouseState = false;
var lookRadius = LOOK_RADIUS;

var inputDisabled = false;

//game variables
// game variables
var recordScore = 0;
var currentScore = 0;
var hasGameEnded = false;
var maxLives = 2;
var currentLives = 2;
var maxNumBricks = 0;
var currentNumBricks = 0;

function initializeObjects(){
    objectsList = [] //restarting game

    //ball
    ball = new Ball(new Vec2(0, BALL_Y), new Vec2(BALL_RADIUS, BALL_RADIUS));

    //paddle
    paddle = new Paddle(new Vec2(0, PADDLE_Y), new Vec2(2.4, 0.30));

    //right wall
    wallRight = new Wall(new Vec2(-15.5, -5), new Vec2(0.75, 19));

    //left wall
    wallLeft = new Wall(new Vec2(15.5, -5), new Vec2(0.75, 19));    

    //upper wall
    wallUp = new Wall(new Vec2(0, -24.0), new Vec2(16.2, 0.75));

    objectsList.push(ball, paddle, wallRight, wallLeft, wallUp); 


    //bricks
    let xStart = -11.3;
    let xStep = 2.5;
    let yStart = 2.7;
    let yStep = 2.1;

    //two bottom lines
    for (let j = 0; j < 2; j++)
    {
        for (let i = 0; i < 10; i++)
        {   
            objectsList.push(new Brick(new Vec2(xStart+xStep*i, yStart-yStep*j), new Vec2(1.0, 0.5)));
        }
    }

    //bottom line
    objectsList.push(new Brick(new Vec2(xStart, -3.6), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+1*xStep, -3.6), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+2*xStep, -3.6), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+3*xStep, -3.6), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+5*xStep, -3.6), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+6*xStep, -3.6), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+7*xStep, -3.6), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+8*xStep, -3.6), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+9*xStep, -3.6), new Vec2(1.0, 0.5)));
    
    //second line
    objectsList.push(new Brick(new Vec2(xStart, -5.7), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+5*xStep, -5.7), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+9*xStep, -5.7), new Vec2(1.0, 0.5)));

    //third line
    objectsList.push(new Brick(new Vec2(xStart, -7.8), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+5*xStep, -7.8), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+7*xStep, -7.8), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+8*xStep, -7.8), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+9*xStep, -7.8), new Vec2(1.0, 0.5)));

    //fourth
    objectsList.push(new Brick(new Vec2(xStart, -9.9), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+5*xStep, -9.9), new Vec2(1.0, 0.5)));

    //fifth line
    objectsList.push(new Brick(new Vec2(xStart, -12), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+1*xStep, -12), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+2*xStep, -12), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+3*xStep, -12), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+5*xStep, -12), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+6*xStep, -12), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+7*xStep, -12), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+8*xStep, -12), new Vec2(1.0, 0.5)));
    objectsList.push(new Brick(new Vec2(xStart+9*xStep, -12), new Vec2(1.0, 0.5)));

    let yStartLastTwo = -16.2;
    //two upper lines
    for (let j = 0; j < 2; j++)
    {
        for (let i = 0; i < 10; i++)
        {   
            objectsList.push(new Brick(new Vec2(xStart+xStep*i, yStartLastTwo-yStep*j), new Vec2(1.0, 0.5)));
        }
    }



    wallsList = objectsList.slice(2, 5);
    bricksList = objectsList.slice(5, objectsList.length);

    maxNumBricks = bricksList.length;
    currentNumBricks = maxNumBricks;

}

function initializeBallAndPaddle() {
    ball = new Ball(new Vec2(0, BALL_Y), new Vec2(BALL_RADIUS, BALL_RADIUS));
    paddle = new Paddle(new Vec2(0, PADDLE_Y), new Vec2(2.4, 0.30));

    ball.hasChanged = true;   // forces redrawn
    paddle.hasChanged = true; // forces redrawn

    objectsList[0] = ball;
    objectsList[1] = paddle;
}

function initializeGame(){ //resetGame()

	initializeObjects(); //inizializza oggetti nel modello logico
	initializeMatrices(); //inizializza le matrici degli oggetti
    hasGameEnded = false;
    currentLives = maxLives;
    currentScore = 0;
    updateScreenText();
}

function notifyBallDeath() {
    initializeBallAndPaddle();
    currentLives--;
    if(currentLives>0)
    {
        // respawn ball
        updateScreenText();
    }
    else
    {
        stopGame();
    }
}

function updateGameState(){
    currentTime = (new Date).getTime();
    deltaTime = currentTime - lastUpdateTime;
    lastUpdateTime = currentTime;

    if(ball.moving){
        ball.moveBall(deltaTime);
    }

    paddle.movePaddle(deltaTime);
}

function stopGame()
{
    currentScore += currentLives * 100;
    if(currentScore > recordScore)
        recordScore = currentScore;
    initializeBallAndPaddle();
    hasGameEnded = true;
    updateScreenText();
    // stop receiving inputs
    window.removeEventListener("keydown", inputDown);
    window.removeEventListener("keyup", inputUp);
    inputDisabled = true;
}

//add listeners on key bindings to move objects
window.addEventListener("keydown", inputDown);
window.addEventListener("keyup", inputUp);
window.addEventListener("keydown", reset);

function inputDown(e) {
    if (e.key === "a" || e.key === "ArrowLeft") {
        //move paddle to left
        paddle.moveLeft = true;
    }
    if (e.key === "d" || e.key === "ArrowRight") {
        //move paddle to right
        paddle.moveRight = true;
    }
    if (e.keyCode == 32){      
        ball.startMoving();
    }      
}

function reset(e) {
    if (e.keyCode === 13) { // press enter
        initializeGame();
        if(inputDisabled)
        {
            window.addEventListener("keydown", inputDown);
            window.addEventListener("keyup", inputUp);
            inputDisabled = false;
        }
    }
}

function inputUp(e) {
    if (e.key === "a" || e.key === "ArrowLeft") {
        //stop moving paddle to left
        paddle.moveLeft = false;
    }
    if (e.key === "d" || e.key === "ArrowRight") {
        //stop moving paddle to right
        paddle.moveRight = false;
    }
}

function setUpMouseControls(){
  // add mouse controls for 3D movement
    canvas.addEventListener("mousedown", doMouseDown, false);
    canvas.addEventListener("mouseup", doMouseUp, false);
    canvas.addEventListener("mousemove", doMouseMove, false);
    canvas.addEventListener("mousewheel", doMouseWheel, false);
}

function doMouseDown(event) {
    lastMouseX = event.pageX;
    lastMouseY = event.pageY;
    mouseState = true;
}

function doMouseUp() {
    lastMouseX = -100;
    lastMouseY = -100;
    mouseState = false;
}

function doMouseMove(event) {
    if(mouseState ) {  //&& ThreeDOn
        let dx = event.pageX - lastMouseX;
        let dy = lastMouseY - event.pageY;
        lastMouseX = event.pageX;
        lastMouseY = event.pageY;

        if((dx !== 0) || (dy !== 0)) {
            angle = angle + 0.5 * dx;
            elevation = elevation + 0.5 * dy;
        }
    }
}

function doMouseWheel(event) {
    let nLookRadius = lookRadius + event.wheelDelta/250.0;
    if((nLookRadius > 10.0) && (nLookRadius < 75.0)) {
        lookRadius = nLookRadius;
    }
}