import MathFunctions from "../../Core/MathFunctions.js";

export default class Collisions
{
    constructor()
    {
        this.mathFs = new MathFunctions();
    }

    CollisionHandler(object, objects)
    {
        const objectSize = object.Size;
        const objectPos = object.Pos;
        const objectBottomLeft = this.mathFs.Vec2(objectPos.x - objectSize.x / 2, objectPos.y - objectSize.y / 2);
        const objectTopRight = this.mathFs.Vec2(objectPos.x + objectSize.x / 2, objectPos.y + objectSize.y / 2);

        for (let i = 0; i < objects.Positions.length; i++)
        {
            let object2Size = objects.QuadSize[i];
            let object2Pos = objects.Positions[i];
            let object2BottomLeft = this.mathFs.Vec2(object2Pos.x - object2Size.x / 2, object2Pos.y - object2Size.y / 2);
            let object2TopRight = this.mathFs.Vec2(object2Pos.x + object2Size.x / 2, object2Pos.y + object2Size.y / 2);
            //kollar om object x och y kolliderar i x och y för att bestämma om den kolliderar i 2d 
            let xOverlap = objectBottomLeft.x < object2TopRight.x && objectTopRight.x > object2BottomLeft.x;
            let yOverlap = objectBottomLeft.y < object2TopRight.y && objectTopRight.y > object2BottomLeft.y;

            if (xOverlap && yOverlap)
                console.log("collision detected");
        }
        
    }
}