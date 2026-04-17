import Render from "./Render.js"

export default class Game
{
    constructor()
    {
        console.log("Started");

        this.rend = new Render();
        this.accumulator = 0;
        this.lastTime = performance.now();
        this.GameLoop();
        this.deltaTime = 0;
    }

    GameLoop()
    {
        const cappedFrames = 2;
        const targetDelta = 1 / cappedFrames
        const targetFixedFrames = 20;
        const fixedDeltaTime = 1 / targetFixedFrames;

        const now = performance.now();
        this.deltaTime += (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.accumulator += this.deltaTime;

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
        this.rend.Render();
    }

    FixedUpdate(fixedDeltaTime)
    {
        //console.log(fixedDeltaTime);
    }
}