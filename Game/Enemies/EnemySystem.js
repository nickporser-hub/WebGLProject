import EnemySpawns from "./EnemySpawns.js";
import EnemyMovement from "./EnemyMovement.js";
import MathFunctions from "../../Core/MathFunctions.js";
//skulle kunna flytta till Game.js
import QuadBatchBuilder from "../../Renderer/QuadBatchBuilder.js";
import Animation from "../../Renderer/Animation.js";

export default class EnemySystem//allmänna funktioner om fienden
{
    constructor()
    {
        this.mathFs = new MathFunctions();
        this.enemyQuadSize = this.mathFs.Vec2(96, 96);
        this.enemyColliderSize = this.mathFs.Vec2(60, 90);

        this.quadBatchBuilder = new QuadBatchBuilder(); 
        this.animation = new Animation();

        this.enemySpawns = new EnemySpawns();
        this.enemyMovement = new EnemyMovement();

        this.rounds = new Map(); //Sparar alla rundor i en map
        this.RoundSet();

        this.removeIndexArr = [];//lista på vilka enemies som ska tas bort//temp
        this.enemiesObj = this.RoundGet("round0"); // temp första rundan
        this.enemyUVs;
        this.EnemyUv();
    }

    CreateRound(deltaTime)//vilka enemies som ska renderas
    {
        const round = this.RoundGet("round0"); //vilken runda 
        const enemies = this.RemoveEnemies(round, this.removeIndexArr);
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
        enemies.Pos = this.enemyMovement.BasicLeftMovement(enemies.Pos, deltaTime); // vilken movement de har
        this.enemiesObj = structuredClone(enemies);

        for (let i = 0; i < this.enemiesObj.Size.length; i++)
        {
            this.enemiesObj.Size[i] = this.enemyColliderSize;
        }
        
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
            enemy.Pos.splice(indexArr[i], 1);
            enemy.UVIndex.splice(indexArr[i], 1);
            enemy.Amount--;
            indexArr.splice(i, 1);
        }

        return enemies;
    }

    RoundSet()//sätt rundorna
    {
        const enemyRound0 = this.enemySpawns.Round0(this.enemySpawns.RoundObject(1, this.enemyQuadSize));
        this.rounds.set("round0", enemyRound0);
        const enemyRound1 = this.enemySpawns.Round1(this.enemySpawns.RoundObject(7, this.enemyQuadSize));
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