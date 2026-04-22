import MathFunctions from "./MathFunctions.js";

export default class Camera
{
    constructor()
    {
        this.mathFs = new MathFunctions();
    }

    Update(deltaTime, input)
    {
        let direction = this.mathFs.Vec2(0, 0);
        let playerPos = this.mathFs.Vec2(0, 0);
        let velocity;
        
        if (input.IsKeyDown("w")) direction.y += 1;
        if (input.IsKeyDown("s")) direction.y -= 1;
        if (input.IsKeyDown("d")) direction.x += 1;
        if (input.IsKeyDown("a")) direction.x -= 1;

        if (direction.x + direction.y != 1)
            velocity = 10 / 1.414;
        else 
            velocity = 10;
        playerPos.x = velocity * deltaTime * direction.x;
        playerPos.y = velocity * deltaTime * direction.y;

        let View = new Float32Array // fel view måste fixa nästa gång
        ([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            playerPos.x, playerPos.y, 0, 1
        ]);  
        
        return View;
    }

}