import MathFunctions from "../Core/MathFunctions.js";

export default class Camera
{
    constructor()
    {
        this.mathFs = new MathFunctions();
        this.playerPos = this.mathFs.Vec2(0, 0);
    }

    Update(deltaTime, input)
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
        this.playerPos.x += velocity * deltaTime * direction.x * screenAspect;
        this.playerPos.y += velocity * deltaTime * direction.y;

        let View = new Float32Array
        ([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            this.playerPos.x, this.playerPos.y, 0, 1
        ]);  
        
        return View;
    }

}