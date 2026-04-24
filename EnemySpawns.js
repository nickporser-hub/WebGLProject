import MathFunctions from "./MathFunctions.js"

export default class EnemySpawns
{
    constructor(enemySize)
    {
        this.mathFs = new MathFunctions();
    }

    Round1(scale, enemySize)
    {
        let positions = [];
        let amount = 7;
        const quadSize = this.mathFs.Vec2(enemySize.x * scale, enemySize.y * scale);
        const centerQuad = this.mathFs.Vec2(quadSize.x * -0.5, quadSize.y * -0.5); // centrera quaden

        positions.push(centerQuad); // mitten enemy
        for (let i = 1; i < amount; i++) // skapa positionerna för enemies i scenen
        {
            let coord1 = this.mathFs.Vec2((i + 1), (i + 1));
            let coord2 = this.mathFs.Vec2((i + 1), (-i + 1));

            let pos1 = this.mathFs.Vec2Multiply(centerQuad, coord1);
            let pos2 = this.mathFs.Vec2Multiply(centerQuad, coord2);

            positions.push(pos1);
            positions.push(pos2);
        }

        return {Positions: positions, QuadSize: quadSize, Amount: amount};
    }
}