import MathFunctions from "../Core/MathFunctions.js";
import Shader from "./Shader.js";
import ShaderSources from "../Resources/ShaderSources.js";
import EnemySpawns from "../Game/EnemySpawns.js";
import TextureLoader from "./TextureLoader.js";

export default class Renderer
{
    constructor()
    {
        const canvas = document.getElementById("glCanvas");
        /** @type {WebGL2RenderingContext} */
        this.gl = canvas.getContext("webgl2");
        
        this.mathFs = new MathFunctions();
        this.shaderSources = new ShaderSources();
        this.enemySpawns = new EnemySpawns();
        this.textureLoader = new TextureLoader(this.gl);

        this.spriteSheet = this.mathFs.Vec2(240, 240);
        this.shipSize = this.mathFs.Vec2(48, 48);  
        this.uvIndex = 
        {
            swedenShip: 0,
            finlandShip: 1
        }; 

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
        this.EnemyRender = this.CreateEnemyRender();
        
        const shipsTexture = this.textureLoader.LoadTexture("Assets/Textures/SpaceGameSpriteSheet.png"); // load the texture

        this.objectShaderProgram.Use();
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, shipsTexture);
        this.gl.uniform1i(this.objectShaderProgram.uTexture, 0);// binda texture till shader programmet

        this.OnResize();
    }
    /*
    LoadTexture(url)
    {
        const texture = this.gl.createTexture();
        const img = new Image();
        img.src = url;

        img.onload = () =>
        {
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D
            (
                this.gl.TEXTURE_2D,
                0,
                this.gl.RGBA,
                this.gl.RGBA,
                this.gl.UNSIGNED_BYTE,
                img
            );

            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST); 
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST); 
        };

        return texture;
    }*/

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

    Render(view)
    {
        this.objectShaderProgram.Use();
        this.gl.uniformMatrix4fv(this.objectShaderProgram.uView, false, view);
        
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        //render:

        this.objectShaderProgram.Use();
        this.gl.bindVertexArray(this.PlayerRender.Vao);
        this.gl.drawElements(this.gl.TRIANGLES, this.PlayerRender.indexCount, this.gl.UNSIGNED_SHORT, 0);//drawElements(mode, count, type, offset)

        this.enemyShaderProgram.Use();
        this.gl.bindVertexArray(this.EnemyRender.Vao);
        this.gl.drawElements(this.gl.TRIANGLES, this.EnemyRender.indexCount, this.gl.UNSIGNED_SHORT, 0);

    }

    CreatePlayerRender()
    {
        //UV matte
        const index = this.uvIndex.swedenShip; // vilket rymdskepp som ska renderas
        const texturesPerRow = this.spriteSheet.x / this.shipSize.x;

        const tileX = index % texturesPerRow;
        const tileY = Math.floor(index / texturesPerRow);

        const u0 = tileX * this.shipSize.x / this.spriteSheet.x;
        const v0 = tileY * this.shipSize.y / this.spriteSheet.y;

        const u1 = (tileX + 1) * this.shipSize.x / this.spriteSheet.x;
        const v1 = (tileY + 1) * this.shipSize.y / this.spriteSheet.y;
        //

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

        const Vao = this.CreateRenderer(indices, vertices);

        return {Vao: Vao, indexCount: indices.length};
    }

    CreateEnemyRender()
    {
        let vertices = []; // vertices för quadsen
        let indices = []; // ordern för vertices

        const scale = 2; // skala för quaden
        const enemies = this.enemySpawns.Round1(scale, this.shipSize);
        const positions = enemies.Positions;
        const amount = enemies.Amount;
        const quadSize = enemies.QuadSize;

        for (let i = 0; i < amount; i++)
        {
            //UV matte
            const index = this.uvIndex.finlandShip; // vilket rymdskepp som ska renderas
            const texturesPerRow = this.spriteSheet.x / this.shipSize.x;

            const tileX = index % texturesPerRow;
            const tileY = Math.floor(index / texturesPerRow);

            const u0 = tileX * this.shipSize.x / this.spriteSheet.x;
            const v0 = tileY * this.shipSize.y / this.spriteSheet.y;

            const u1 = (tileX + 1) * this.shipSize.x / this.spriteSheet.x;
            const v1 = (tileY + 1) * this.shipSize.y / this.spriteSheet.y;
            //
            let enemyPos = positions[i]; // enemypositions
            
            vertices.push(enemyPos.x, enemyPos.y, u0, v0);                          // bottomLeft 
            vertices.push(enemyPos.x, enemyPos.y + quadSize.y, u1, v0);             // topLeft 
            vertices.push(enemyPos.x + quadSize.x, enemyPos.y + quadSize.y, u1, v1);// topRight 
            vertices.push(enemyPos.x + quadSize.x, enemyPos.y, u0, v1);             // bottomRight 

            let vertexIndex = i * 4; 

            indices.push(0 + vertexIndex);
            indices.push(1 + vertexIndex);
            indices.push(2 + vertexIndex);
            indices.push(0 + vertexIndex);
            indices.push(2 + vertexIndex);
            indices.push(3 + vertexIndex);
        }

        let Vao = this.CreateRenderer(new Uint16Array(indices), new Float32Array(vertices)); // skapa Vertex array objekt

        return {Vao: Vao, indexCount: indices.length};
    }

    CreateRenderer(indices, vertices)
    {
        const vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(vao);

        const Ebo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, Ebo);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);

        const Vbo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, Vbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        //vertex attribute pointers:
        const stride = 4 * 4; // 4 * sizeof(int) = 4 * 4 

        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, stride, 0);
        this.gl.vertexAttribDivisor(0, 0); // ändra vertex position varje vertex för attrib 0

        this.gl.enableVertexAttribArray(1);
        this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, stride, 2 * 4); //offset = sizeofVector2 
        this.gl.vertexAttribDivisor(1, 0);

        this.gl.bindVertexArray(null);

        return vao;
    }
}