import EnemySpawns from "./EnemySpawns.js";
import EnemyMovement from "./EnemyMovement.js";
import MathFunctions from "../Core/MathFunctions.js";
import QuadBatchBuilder from "../Renderer/QuadBatchBuilder.js";
import TextureCoords from "../Renderer/TextureCoords.js";

export default class EnemySystem
{
    constructor()
    {
        this.mathFs = new MathFunctions();
        this.enemySize = this.mathFs.Vec2(48, 48);

        this.shipTextureCoords = new TextureCoords(this.mathFs.Vec2(240, 240), this.enemySize);
        this.quadBatchBuilder = new QuadBatchBuilder(); 

        this.enemySpawns = new EnemySpawns();
        this.enemyMovement = new EnemyMovement();

        this.rounds = new Map() //Sparar alla rundor i en map
        
        this.enemyRound1 = this.enemySpawns.Round1(this.enemySize);
        //let enemies = this.enemyPos.Round1(this.enemySize);
        //this.enemyQuadBatch = this.CreateEnemyQuadBatch(enemies);
    }

    CreateEnemyQuadBatch(deltaTime)
    {
        let enemies = this.enemyRound1;//vilken enemies runda som används //temp
        enemies.Positions = this.enemyMovement.BasicLeftMovement(enemies.Positions, deltaTime); // vilken movement de har

        const amount = enemies.Amount;
        const index = enemies.UVIndex;
        const UVs = this.shipTextureCoords.GetUV(index, amount);

        const quadBatch = this.quadBatchBuilder.CreateQuadBatch(enemies, UVs);

        return quadBatch; 
    }

    /*
    RoundSet()
    {

    }

    RoundGet()
    {

    }*/
}