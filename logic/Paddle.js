class Paddle {
    constructor(position, scale)
    {
        this.position = position;
        this.scale = scale;
        this.hasChanged = false;

        this.canBeDisabled = false;
        this.disabled = false;
        this.isPaddle = true;
        this.speed = PADDLE_SPEED;
    }

    moveLeft = false;
    moveRight = false;

    movePaddle(deltaTime)
    {
        if(this.moveLeft)
        {
            this.hasChanged = true;
            this.position.x -= this.speed * deltaTime;
        }
        else if(this.moveRight)
        {
            this.hasChanged = true;
            this.position.x += this.speed * deltaTime;
        }

        // very ugly code to limit paddle position inside walls
        if(this.position.x+this.scale.x > wallLeft.position.x-wallLeft.scale.x-PADDLE_WALL_PADDING)
        {
            this.position.x = wallLeft.position.x-wallLeft.scale.x-this.scale.x-PADDLE_WALL_PADDING;
        }
        else if(this.position.x-this.scale.x < wallRight.position.x+wallRight.scale.x+PADDLE_WALL_PADDING)
        {
            this.position.x = wallRight.position.x+wallRight.scale.x+this.scale.x+PADDLE_WALL_PADDING;
        }
    }
}