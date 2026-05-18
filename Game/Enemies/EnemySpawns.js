import MathFunctions from "../../Core/MathFunctions.js";

export default class EnemySpawns
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

    Round1(enemySize)
    {
        let uvIndex = [];
        let positions = [];
        let quadSizes = [];
        let amount = 7;
        const quadSize = this.mathFs.Vec2(enemySize.x, enemySize.y);
        const centerQuad = this.mathFs.Vec2(quadSize.x * -0.5, quadSize.y * -0.5); // centrera quaden
        
        quadSizes.push(quadSize);
        positions.push(this.mathFs.Vec2Add(centerQuad, this.mathFs.Vec2(1000, 0))); // mitten enemy
        uvIndex.push(this.uvIndex.duckBird);
        for (let i = 1; i < (amount + 1) / 2; i++) // skapa positionerna för enemies i scenen
        {
            quadSizes.push(quadSize);
            quadSizes.push(quadSize);

            let coord1 = this.mathFs.Vec2((i * 1.5 + 1), (i * 1.5 + 1));
            let coord2 = this.mathFs.Vec2((i * 1.5 + 1), (-i * 1.5 + 1));
            
            let pos1 = this.mathFs.Vec2Add(this.mathFs.Vec2Multiply(centerQuad, coord1), this.mathFs.Vec2(1000, 0));
            let pos2 = this.mathFs.Vec2Add(this.mathFs.Vec2Multiply(centerQuad, coord2), this.mathFs.Vec2(1000, 0));
            
            positions.push(pos1);
            positions.push(pos2);
            
            uvIndex.push(this.uvIndex.duckBird);
            uvIndex.push(this.uvIndex.duckBird);
        }
        
        return {Pos: positions, Size: quadSizes, Amount: amount, UVIndex: uvIndex};
    }
}