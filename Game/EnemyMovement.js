export default class
{
    constructor()
    {

    }

    BasicLeftMovement(positions, deltaTime)
    {
        let pos = positions;   
        let velocity = 100;
        for (let i = 0; i < pos.length; i++)
        {
            pos[i].x -= velocity * deltaTime;
            if (pos[i].x < -1200)
                pos[i].x = 300;
        }
        return pos;
    }
}