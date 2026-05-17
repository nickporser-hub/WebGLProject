import MathFunctions from "../../Core/MathFunctions.js";

export default class Movement
{
    constructor()
    {
        this.mathFs = new MathFunctions();
    }

    Update(deltaTime, input, playerPos)
    {
        const screenAspect = window.innerHeight / window.innerWidth;
        let direction = this.mathFs.Vec2(0, 0);
        let velocity;
        
        if (input.IsKeyDown("w")) direction.y += 1;
        if (input.IsKeyDown("s")) direction.y -= 1;
        if (input.IsKeyDown("d")) direction.x += 1;
        if (input.IsKeyDown("a")) direction.x -= 1;

        if (direction.x * direction.y != 0)
            velocity = 2 / 1.414;
        else 
            velocity = 2;
        playerPos.x += velocity * deltaTime * direction.x * screenAspect * window.innerWidth / 2;
        playerPos.y += velocity * deltaTime * direction.y * window.innerHeight / 2;

        return playerPos;
    }

}