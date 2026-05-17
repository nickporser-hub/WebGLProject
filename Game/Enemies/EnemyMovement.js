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
            if (pos[i].x < -window.innerWidth) // temp fix ska göra relativ till skärmen
                pos[i].x = window.innerWidth * 0.7;
        }
        return pos;
    }
}