import Render from "../Renderer/Render.js";
import Inputs from "./Inputs.js";
import Camera from "./Camera.js";
import EnemySystem from "./EnemySystem.js";

export default class Game
{
    constructor()
    {
        console.log("Started");

        this.enemySystem = new EnemySystem();
        this.rend = new Render();
        this.inputs = new Inputs();
        this.camera = new Camera();

        this.accumulator = 0;
        this.lastTime = performance.now();
        this.deltaTime = 0;
        this.GameLoop();
    }

    GameLoop()
    {
        const cappedFrames = 100;
        const targetDelta = 1 / cappedFrames
        const targetFixedFrames = 20;
        const fixedDeltaTime = 1 / targetFixedFrames;

        const now = performance.now();
        const time = (now - this.lastTime) / 1000;
        this.deltaTime += time;
        this.lastTime = now;

        this.accumulator += time;

        while (this.accumulator >= fixedDeltaTime)
        {
            this.FixedUpdate(fixedDeltaTime);
            this.accumulator -= fixedDeltaTime;
        }
        if (this.deltaTime >= targetDelta)
        {
            this.Update(this.deltaTime);   
            this.deltaTime = 0
        }

        requestAnimationFrame(() => this.GameLoop());
    }

    Update(deltaTime)
    {
        //console.log(deltaTime);
        this.inputs.FixedUpdate();
        // temp ska nog flyttas till fixedupdate
        let view = this.camera.Update(deltaTime, this.inputs);
        this.rend.Render(view, this.enemySystem.enemyQuadBatch);
        
    }

    FixedUpdate(fixedDeltaTime) 
    {
        
    }
}