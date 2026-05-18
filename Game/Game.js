import Render from "../Renderer/Render.js";
import Inputs from "./Inputs.js";
import EnemySystem from "./Enemies/EnemySystem.js";
import PlayerSystem from "./Player/PlayerSystem.js";
import Camera from "../Renderer/Camera.js";
import ShaderManager from "../Renderer/ShaderManager.js";
import Collisions from "./Physics/Collisions.js";

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
        this.playerSystem = new PlayerSystem();
        this.rend = new Render(this.gl, this.shaderManager);
        this.inputs = new Inputs();
        this.collisions = new Collisions();

        this.accumulator = 0;
        this.lastTime = performance.now();
        this.deltaTime = 0;

        this.Start();
        this.GameLoop();
    }

    GameLoop() // simpel gameloop
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
        this.inputs.FixedUpdate();
        // temp ska nog flyttas till fixedupdate
        this.playerSystem.PlayerMovement(deltaTime, this.inputs);
        this.camera.CameraView(this.playerSystem.playerObj.Pos);
        //console.log(this.playerSystem.playerObj.Pos);

        this.Render(deltaTime);        

        
    }

    Render(deltaTime)
    {
        this.rend.ClearScreen();
        this.rend.Render(this.shaderManager.Get("object"), this.playerSystem.CreatePlayerQuadBatch());//playerQuadBatch);
        this.rend.Render(this.shaderManager.Get("enemy"), this.enemySystem.CreateRound(deltaTime));
    }

    FixedUpdate(fixedDeltaTime) //runar med fixad tick
    {
        this.playerSystem.FixedUpdate();
        this.enemySystem.FixedUpdate();
        this.collisions.CollisionHandler(this.playerSystem.playerObj, this.enemySystem.enemiesObj);//kolla colliders
    }

    Start()
    {

    }
}