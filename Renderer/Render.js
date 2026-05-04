import MathFunctions from "../Core/MathFunctions.js";
import TextureLoader from "./TextureLoader.js";
import Mesh from "./Mesh.js";

export default class Renderer
{
    constructor(gl, shaderManager)
    {
        /** @type {WebGL2RenderingContext} */
        this.gl = gl;
        
        this.mathFs = new MathFunctions();
        this.shaderManager = shaderManager;
        this.textureLoader = new TextureLoader(this.gl);

        this.Initialize();
    }

    Initialize()
    {
        if (!this.gl) 
        {
            alert("WebGL not supported by your browser!");
        }
        this.gl.clearColor(0.2, 0.4, 0.5, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        //tillåt transparans
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        //

        this.objectShader = this.shaderManager.Get("object");
        this.enemyShader = this.shaderManager.Get("enemy");

        const staticView = new Float32Array //temporär startposition för stilla objekt
        ([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0.7, 0, 0, 1
        ]);  

        this.enemyShader.Use();
        this.enemyShader.UniformMatrix4fv(this.enemyShader.uView, staticView);

        const shipsTexture = this.textureLoader.LoadTexture("Assets/Textures/SpaceGameSpriteSheet.png"); // load the texture
        this.objectShader.TextureUniform(this.objectShader.uTexture, shipsTexture, 0);
        this.enemyShader.TextureUniform(this.enemyShader.uTexture, shipsTexture, 0);
    }

    Render(shader, quadBatch) //rendera varje frame
    {   
        let mesh = this.CreateMesh(quadBatch);

        this.Draw(shader, mesh);
    }

    Draw(shader, mesh)
    {
        shader.Use();
        mesh.Bind();
        this.gl.drawElements(this.gl.TRIANGLES, mesh.indexCount, this.gl.UNSIGNED_SHORT, 0);//drawElements(mode, count, type, offset)
    }

    ClearScreen()
    {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    CreateMesh(quadBatch)
    {
        const mesh = new Mesh(this.gl, new Uint16Array(quadBatch.Indices), new Float32Array(quadBatch.Vertices));
        return mesh;
    }
}