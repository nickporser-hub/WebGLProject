import MathFunctions from "../Core/MathFunctions.js";
export default class PlayerVertices
{
    constructor()
    {
        this.mathFs = new MathFunctions();
        this.uvIndex = 
        {
            swedenShip: 0,
            finlandShip: 1
        }; 
    }

    PlayerSpawn(playerSize)
    {
        let uvIndex = [];
        let scale = 3;
        let positions = [];
        let amount = 1;
        const quadSize = this.mathFs.Vec2(playerSize.x * scale, playerSize.y * scale);
        const centerQuad = this.mathFs.Vec2(quadSize.x * -0.5, quadSize.y * -0.5); // centrera quaden

        positions.push(centerQuad);

        uvIndex.push(this.uvIndex.swedenShip);
        
        return {Positions: positions, QuadSize: quadSize, Amount: amount, UVIndex: uvIndex};
    }
}