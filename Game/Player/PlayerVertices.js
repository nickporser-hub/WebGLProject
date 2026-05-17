import MathFunctions from "../../Core/MathFunctions.js";
export default class PlayerVertices
{
    constructor()
    {
        this.mathFs = new MathFunctions();
        this.uvIndex = 
        {
            whiteBird: 0,
            duckBird: 6
        }; 
    }

    PlayerSpawn(playerSize)
    {
        let uvIndex = [];
        let scale = 3;
        let positions = [];
        let amount = 1;
        let quadSizes = [];
        const quadSize = this.mathFs.Vec2(playerSize.x * scale, playerSize.y * scale);
        const centerQuad = this.mathFs.Vec2(0, 0);
        quadSizes.push(quadSize);

        positions.push(centerQuad);

        uvIndex.push(this.uvIndex.whiteBird);
        
        return {Positions: positions, QuadSize: quadSizes, Amount: amount, UVIndex: uvIndex};
    }
}