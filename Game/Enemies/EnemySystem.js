import EnemySpawns from "./EnemySpawns.js";
import EnemyMovement from "./EnemyMovement.js";
import MathFunctions from "../../Core/MathFunctions.js";
//skulle kunna flytta till Game.js
import QuadBatchBuilder from "../../Renderer/QuadBatchBuilder.js";
import Animation from "../../Renderer/Animation.js";

export default class EnemySystem
{
    constructor()
    {
        this.mathFs = new MathFunctions();
        this.enemySize = this.mathFs.Vec2(48, 48);

        this.quadBatchBuilder = new QuadBatchBuilder(); 
        this.animation = new Animation();

        this.enemySpawns = new EnemySpawns();
        this.enemyMovement = new EnemyMovement();

        this.rounds = new Map(); //Sparar alla rundor i en map
        this.RoundSet();

        this.removeIndexArr = [];////////////////////temp lista på vilka enemies som ska tas bort
        this.enemiesObj = this.RoundGet("round1");
        this.enemyUVs;
        this.EnemyUv();
    }

    CreateRound(deltaTime)//vilka enemies som ska renderas
    {
        const round1 = this.RoundGet("round1");
        const enemies = this.RemoveEnemies(round1, this.removeIndexArr);
        const batch = this.CreateEnemyQuadBatch(deltaTime, enemies);
        return batch;
    }

    FixedUpdate()
    {
        this.EnemyUv();
    }

    EnemyUv()
    {
        const iterations = 2;
        this.enemyUv = this.animation.BirdAnimation(this.enemiesObj.UVIndex[0], this.enemiesObj.Amount, iterations);
    }

    CreateEnemyQuadBatch(deltaTime, enemies)
    {
        enemies.Positions = this.enemyMovement.BasicLeftMovement(enemies.Positions, deltaTime); // vilken movement de har
        this.enemiesObj = enemies;
        
        const amount = enemies.Amount;
        const index = enemies.UVIndex;

        const quadBatch = this.quadBatchBuilder.CreateQuadBatch(enemies, this.enemyUv);

        return quadBatch; 
    }

    RemoveEnemies(enemies, indexArr)
    {
        let enemy = enemies; 
        for (let i = 0; i < indexArr.length; i++)
        {
            enemy.Positions.splice(indexArr[i], 1);
            enemy.UVIndex.splice(indexArr[i], 1);
            enemy.Amount--;
            indexArr.splice(i, 1);
        }

        return enemies;
    }

    RoundSet()//sätt rundorna
    {
        const enemyRound1 = this.enemySpawns.Round1(this.enemySize);
        this.rounds.set("round1", enemyRound1);
    }

    RoundGet(name)// ta rundorna
    {
        const round = this.rounds.get(name);
        if (!round)
        {
            throw new Error(`Round '${name}' not found`);
        }
        return round;
    }
}