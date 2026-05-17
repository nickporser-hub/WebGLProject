import MathFunctions from "../../Core/MathFunctions.js";
import PlayerVertices from "./PlayerVertices.js";
import Movement from "./Movement.js";
//skulle kunna flytta till Game.js
import QuadBatchBuilder from "../../Renderer/QuadBatchBuilder.js";
import Animation from "../../Renderer/Animation.js";

export default class PlayerSystem
{
    constructor()
    {
        this.mathFs = new MathFunctions();
        this.playerSize = this.mathFs.Vec2(48, 48);
        this.playerVertices = new PlayerVertices();
        this.movement = new Movement();

        this.animation = new Animation();
        this.quadBatchBuilder = new QuadBatchBuilder(); 
        
        this.player = this.playerVertices.PlayerSpawn(this.playerSize);
        this.playerObj = {Size: this.player.QuadSize[0], Pos: this.mathFs.Vec2(0, 0)};

        this.playerUVs;
        this.PlayerUV();

        this.playerQuadBatch = this.CreatePlayerQuadBatch();
    }

    FixedUpdate()
    {
        this.PlayerUV();
    }

    PlayerUV() 
    {
        const iterations = 4;
        const UVs = this.animation.BirdAnimation(this.player.UVIndex, this.player.Amount, iterations);
        const u0 = [UVs.U0[0]];
        const v0 = [UVs.V0[0]];
        const u1 = [UVs.U1[0]];
        const v1 = [UVs.V1[0]];
        this.playerUVs = {U0: u1, V0: v1, U1: u0, V1: v0};
    }

    CreatePlayerQuadBatch()
    {
        let quadBatch = this.quadBatchBuilder.CreateQuadBatch(this.player, this.playerUVs);
        return quadBatch;
    }

    PlayerMovement(deltaTime, inputs)
    {
        this.playerObj.Pos = this.movement.Update(deltaTime, inputs, this.playerObj.Pos);
    }
}