import MathFunctions from "../Core/MathFunctions.js";
import Shader from "./Shader.js";
import ShaderSources from "../Resources/ShaderSources.js";
import TextureLoader from "./TextureLoader.js";
import Mesh from "./Mesh.js";

//Temp
import TextureCoords from "./TextureCoords.js";
import QuadBatchBuilder from "./QuadBatchBuilder.js";
//

export default class Renderer
{
    constructor()
    {
        const canvas = document.getElementById("glCanvas");
        /** @type {WebGL2RenderingContext} */
        this.gl = canvas.getContext("webgl2");
        
        this.mathFs = new MathFunctions();
        this.shaderSources = new ShaderSources();
        this.textureLoader = new TextureLoader(this.gl);

        
        //Temp
        this.quadBatchBuilder = new QuadBatchBuilder();
        this.shipTextureCoords = new TextureCoords(this.mathFs.Vec2(240, 240), this.mathFs.Vec2(48, 48));

        this.spriteSheet = this.mathFs.Vec2(240, 240);
        this.shipSize = this.mathFs.Vec2(48, 48);  
        this.uvIndex = 
        {
            swedenShip: 0,
            finlandShip: 1
        }; 
        ///////

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

        window.addEventListener("resize", this.OnResize.bind(this));

        this.objectShaderProgram = new Shader(this.gl, this.shaderSources.objectVertexShaderSource, this.shaderSources.fragmentShaderSource); 
        this.enemyShaderProgram = new Shader(this.gl, this.shaderSources.objectVertexShaderSource, this.shaderSources.fragmentShaderSource);

        const staticView = new Float32Array //temporär startposition för stilla objekt
        ([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0.7, 0, 0, 1
        ]);  

        this.enemyShaderProgram.Use();
        this.gl.uniformMatrix4fv(this.enemyShaderProgram.uView, false, staticView);

        this.PlayerRender = this.CreatePlayerRender();
        //this.EnemyRender = this.CreateEnemyRender(this.enemies);
        
        const shipsTexture = this.textureLoader.LoadTexture("Assets/Textures/SpaceGameSpriteSheet.png"); // load the texture

        this.objectShaderProgram.Use();
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, shipsTexture);
        this.gl.uniform1i(this.objectShaderProgram.uTexture, 0);// binda texture till shader programmet

        this.OnResize();
    }

    OnResize() // fixa onresize//
    {
        this.gl.viewport(0, 0, window.innerWidth, window.innerHeight);
        this.gl.canvas.width = window.innerWidth;
        this.gl.canvas.height = window.innerHeight;

        const zoomFactor = 1;
        let screenSize = this.mathFs.Vec2(window.innerWidth * zoomFactor, window.innerHeight * zoomFactor);
        let startProjection = this.mathFs.Vec2(-screenSize.x / 2, -screenSize.y / 2); //subtrahera med en halv skärm för att centrera

        const left = startProjection.x;
        const right = this.gl.canvas.width * zoomFactor + startProjection.x;
        const bottom = startProjection.y;
        const top = this.gl.canvas.height * zoomFactor + startProjection.y;
        const near = -1;
        const far = 1;

        const projection = new Float32Array([
            2 / (right - left), 0, 0, 0,
            0, 2 / (top - bottom), 0, 0,
            0, 0, -2 / (far - near), 0,
            -(right + left) / (right - left),
            -(top + bottom) / (top - bottom),
            -(far + near) / (far - near),
            1
        ]);

        this.objectShaderProgram.Use();  
        this.gl.uniformMatrix4fv(this.objectShaderProgram.uProjection, false, projection);
        this.enemyShaderProgram.Use();
        this.gl.uniformMatrix4fv(this.enemyShaderProgram.uProjection, false, projection);
    }

    Render(view, quadBatch) //rendera varje frame
    {
        this.objectShaderProgram.Use();
        this.gl.uniformMatrix4fv(this.objectShaderProgram.uView, false, view);
        
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        //render:

        let mesh = this.CreateMesh(quadBatch);

        this.Draw(this.objectShaderProgram, this.PlayerRender);
        this.Draw(this.enemyShaderProgram, mesh);
    }

    Draw(program, mesh)
    {
        program.Use();
        mesh.Bind();
        this.gl.drawElements(this.gl.TRIANGLES, mesh.indexCount, this.gl.UNSIGNED_SHORT, 0);//drawElements(mode, count, type, offset)
    }

    CreatePlayerRender()
    {
        const amount = 1;
        const index = [];
        index.push(this.uvIndex.swedenShip); // vilket rymdskepp som ska renderas
        const UVs = this.shipTextureCoords.GetUV(index, amount);
        const u0 = UVs.U0[0];
        const v0 = UVs.V0[0];
        const u1 = UVs.U1[0];
        const v1 = UVs.V1[0];

        const scale = 4; // skala för quaden
        const quadSize = this.mathFs.Vec2(this.shipSize.x * scale, this.shipSize.y * scale);
        const quadPos = this.mathFs.Vec2(quadSize.x * -0.5, quadSize.y * -0.5); // centrera quaden
        const vertices = new Float32Array
        ([
            quadPos.x, quadPos.y,                               u1, v1, // bottomLeft 
            quadPos.x, quadPos.y + quadSize.y,                  u0, v1, // topLeft 
            quadPos.x + quadSize.x, quadPos.y + quadSize.y,     u0, v0, // topRight 
            quadPos.x + quadSize.x, quadPos.y,                  u1, v0  // bottomRight  
        ]);

        const indices = new Uint16Array
        ([
            0, 1, 2,
            0, 2, 3
        ]);

        //const Vao = this.CreateRenderer(indices, vertices);
        const mesh = new Mesh(this.gl, indices, vertices);

        return mesh;
    }

    CreateMesh(quadBatch)
    {
        const mesh = new Mesh(this.gl, new Uint16Array(quadBatch.Indices), new Float32Array(quadBatch.Vertices));
        return mesh;
    }
    
}