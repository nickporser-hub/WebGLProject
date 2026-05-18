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

    RoundObject(amount, enemySize)//nytt rundsystem
    {
        const quadSize = this.mathFs.Vec2(enemySize.x, enemySize.y);
        const centerQuad = this.mathFs.Vec2(quadSize.x * -0.5, quadSize.y * -0.5); // centrera quaden
        const enemyObject = {QuadSize: quadSize, CenterQuad: centerQuad, Amount: amount};
        return enemyObject;
    }

    Round0(enemyObj)//nytt rundsystem test
    {
        let uvIndex = [];
        let positions = [];
        let quadSizes = [];
        quadSizes.push(enemyObj.QuadSize);
        positions.push(this.mathFs.Vec2Add(enemyObj.CenterQuad, this.mathFs.Vec2(1000, 0))); // mitten enemy
        uvIndex.push(this.uvIndex.duckBird);
        
        return {Pos: positions, Size: quadSizes, Amount: enemyObj.Amount, UVIndex: uvIndex};
    }

    Round1(enemyObj)
    {
        let uvIndex = [];
        let positions = [];
        let quadSizes = [];
        
        quadSizes.push(enemyObj.QuadSize);
        positions.push(this.mathFs.Vec2Add(enemyObj.CenterQuad, this.mathFs.Vec2(1000, 0))); // mitten enemy
        uvIndex.push(this.uvIndex.duckBird);
        for (let i = 1; i < (enemyObj.Amount + 1) / 2; i++) // skapa positionerna för enemies i scenen
        {
            quadSizes.push(enemyObj.QuadSize);
            quadSizes.push(enemyObj.QuadSize);

            let coord1 = this.mathFs.Vec2((i * 1.5 + 1), (i * 1.5 + 1));
            let coord2 = this.mathFs.Vec2((i * 1.5 + 1), (-i * 1.5 + 1));
            
            let pos1 = this.mathFs.Vec2Add(this.mathFs.Vec2Multiply(enemyObj.CenterQuad, coord1), this.mathFs.Vec2(1000, 0));
            let pos2 = this.mathFs.Vec2Add(this.mathFs.Vec2Multiply(enemyObj.CenterQuad, coord2), this.mathFs.Vec2(1000, 0));
            
            positions.push(pos1);
            positions.push(pos2);
            
            uvIndex.push(this.uvIndex.duckBird);
            uvIndex.push(this.uvIndex.duckBird);
        }
        
        return {Pos: positions, Size: quadSizes, Amount: enemyObj.Amount, UVIndex: uvIndex};
    }
}