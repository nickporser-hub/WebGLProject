import EnemySpawns from "./EnemySpawns.js";
import MathFunctions from "../Core/MathFunctions.js";
import QuadBatchBuilder from "../Renderer/QuadBatchBuilder.js";
import TextureCoords from "../Renderer/TextureCoords.js";

export default class EnemySystem
{
    constructor()
    {
        this.mathFs = new MathFunctions();
        this.enemySize = this.mathFs.Vec2(48, 48);

        this.shipTextureCoords = new TextureCoords(this.mathFs.Vec2(240, 240), this.mathFs.Vec2(48, 48));
        this.quadBatchBuilder = new QuadBatchBuilder(); 

        this.enemySpawns = new EnemySpawns();
        
        let enemies = this.enemySpawns.Round1(this.enemySize);
        this.enemyQuadBatch = this.CreateEnemyQuadBatch(enemies);
    }

    CreateEnemyQuadBatch(enemies)
    {
        const amount = enemies.Amount;
        const index = enemies.UVIndex;
        const UVs = this.shipTextureCoords.GetUV(index, amount);

        const batchBuilder = this.quadBatchBuilder.CreateEnemyRender(enemies, UVs);

        return batchBuilder; 
    }
}