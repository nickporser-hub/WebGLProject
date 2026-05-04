import Render from "../Renderer/Render.js";
import Inputs from "./Inputs.js";
import Movement from "./Movement.js";
import EnemySystem from "./EnemySystem.js";
import PlayerSystem from "./PlayerSystem.js";
import Camera from "../Renderer/Camera.js";
import ShaderManager from "../Renderer/ShaderManager.js";

export default class Game
{
    constructor()
    {
        console.log("Started");
        const canvas = document.getElementById("glCanvas"); // definera canvas
        this.gl = canvas.getContext("webgl2"); // definera webgl

        this.shaderManager = new ShaderManager(this.gl);
        this.camera = new Camera(this.gl, this.shaderManager);
        this.enemySystem = new EnemySystem();
        this.PlayerSystem = new PlayerSystem();
        this.rend = new Render(this.gl, this.shaderManager);
        this.inputs = new Inputs();
        this.movement = new Movement();

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
        let playerPos = this.movement.Update(deltaTime, this.inputs);
        this.camera.CameraView(playerPos);

        this.rend.ClearScreen();
        this.rend.Render(this.shaderManager.Get("object"), this.PlayerSystem.playerQuadBatch);
        this.rend.Render(this.shaderManager.Get("enemy"), this.enemySystem.enemyQuadBatch);
    }

    FixedUpdate(fixedDeltaTime) 
    {
        
    }
}