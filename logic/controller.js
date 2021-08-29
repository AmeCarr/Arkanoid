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