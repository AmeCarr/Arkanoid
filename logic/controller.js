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

function initializeObjects(){
	 /**
     * x goes from right to left
     * y goes from up to down
     */
    objectsList = [] //restarting game

	ball = new Ball(new Vec2(0, BALL_Y), new Vec2(1, 1));
    paddle = new Paddle(new Vec2(0, PADDLE_Y), new Vec2(1, 1));
    wallLeft = new Wall(new Vec2(-29, -3), new Vec2(1, 1));
    wallRight = new Wall(new Vec2(32, -3), new Vec2(1, 1));

    wallUp = new Wall(new Vec2(1.5, -21.5), new Vec2(1, 1));

    objectsList.push(ball, paddle, wallLeft, wallRight, wallUp); 

    let xStart = -23.2;
    let xStep = 4.1;
    let yStart = -10;
    let yStep = 2.1;
    for (let j = 0; j < 3; j++)
    {
        for (let i = 0; i < 13; i++)
        {
            objectsList.push(new Brick(new Vec2(xStart+xStep*i, yStart-yStep*j), new Vec2(1, 1)));
        }
    }

    wallsList = objectsList.slice(2, 5);
    bricksList = objectsList.slice(5, objectsList.length);

    maxNumBricks = bricksList.length;
    currentNumBricks = maxNumBricks;

}


function initializeGame(){ //resetGame()

	initializeObjects(); //inizializza oggetti nel modello logico
	initializeMatrices(); //inizializza le matrici degli oggetti

	//variabili di inizio gioco + aggiorna schermo

}

function updateGameState(){

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
    //if(ThreeDOn)
    //{
        let nLookRadius = lookRadius + event.wheelDelta/250.0;
        if((nLookRadius > 10.0) && (nLookRadius < 75.0)) {
            lookRadius = nLookRadius;
        }
    //}
}