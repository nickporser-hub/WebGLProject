import MathFunctions from "../Core/MathFunctions.js";
import TextureCoords from "../Renderer/TextureCoords.js";
import QuadBatchBuilder from "../Renderer/QuadBatchBuilder.js";
import PlayerVertices from "./PlayerVertices.js";

export default class PlayerSystem
{
    constructor()
    {
        this.mathFs = new MathFunctions();
        this.playerSize = this.mathFs.Vec2(48, 48);
        this.playerVertices = new PlayerVertices();
        this.shipTextureCoords = new TextureCoords(this.mathFs.Vec2(240, 240), this.playerSize);
        this.quadBatchBuilder = new QuadBatchBuilder(); 
        this.playerQuadBatch = this.CreatePlayerQuadBatch();
    }

    CreatePlayerQuadBatch()
    {
        let player = this.playerVertices.PlayerSpawn(this.playerSize);

        const UVs = this.shipTextureCoords.GetUV(player.UVIndex, player.Amount);
        const u0 = [UVs.U0[0]];
        const v0 = [UVs.V0[0]];
        const u1 = [UVs.U1[0]];
        const v1 = [UVs.V1[0]];
        const newUVs = {U0: u1, V0: v1, U1: u0, V1: v0};

        let quadBatch = this.quadBatchBuilder.CreateQuadBatch(player, newUVs);
       
        return quadBatch;
    }
}