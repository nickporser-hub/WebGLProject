import MathFunctions from "../../Core/MathFunctions.js";

export default class PlayerVertices //lite logik för spelarens vertices
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
        let positions = [];
        let amount = 1;
        let quadSizes = [];
        const quadSize = this.mathFs.Vec2(playerSize.x, playerSize.y);
        const centerQuad = this.mathFs.Vec2(-playerSize.x / 2, -playerSize.y /2);
        quadSizes.push(quadSize);

        positions.push(centerQuad);

        uvIndex.push(this.uvIndex.whiteBird);
        
        return {Pos: positions, Size: quadSizes, Amount: amount, UVIndex: uvIndex};
    }
}