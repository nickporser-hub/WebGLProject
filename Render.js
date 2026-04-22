import MathFunctions from "./MathFunctions.js"

export default class Renderer
{
    constructor()
    {
        const canvas = document.getElementById("glCanvas");
        /** @type {WebGL2RenderingContext} */
        this.gl = canvas.getContext("webgl2");
        
        this.mathFs = new MathFunctions();
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

        this.CreatePlayerRender();
        
        const objectVertexShaderSource = `#version 300 es

            layout(location = 0) in vec2 aPosition;
            layout(location = 1) in vec2 aUV;

            out vec2 vUV; 

            uniform mat4 uProjection;
            uniform mat4 uView;

            void main()
            {
                gl_Position = uProjection * vec4(aPosition, 0.0, 1.0);
                vUV = aUV;
            }
        `;
        const fragmentShaderSource = `#version 300 es
            
            precision mediump float;

            in vec2 vUV; 
            out vec4 FragColor;

            uniform sampler2D uTexture;

            void main()
            {
                FragColor = texture(uTexture, vUV);
            }
        `;

        const objectVertexShader = this.CreateShader(this.gl.VERTEX_SHADER, objectVertexShaderSource);
        const fragmentShader = this.CreateShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        this.objectShaderProgram = this.CreateObjectShader(objectVertexShader, fragmentShader);

        this.gl.deleteShader(objectVertexShader);
        this.gl.deleteShader(fragmentShader); // delete shaders de sparas i shaderPrograms

        const shipsTexture = this.LoadTexture("Assets/Textures/SpaceGameSpriteSheet.png");

        this.objectShaderProgram.Use();
        this.gl.uniform1i(this.objectShaderProgram.UniformLoc.uTextureLoc, shipsTexture);

        this.OnResize();
    }

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

            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST); // kanske linear
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST); 
        };

        return texture;
    }

    CreateObjectShader(vertexShader, fragmentShader)
    {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        const ObjectShaderProgram =
        {
            Program: program,
            UniformLoc:
            {
                uProjectionLoc: this.gl.getUniformLocation(program, "uProjection"),
                uTextureLoc: this.gl.getUniformLocation(program, "uTexture"),
                uViewLoc: this.gl.getUniformLocation(program, "uView"),
            },
            Use: () =>
            {
                this.gl.useProgram(program);
            }
        };

        return ObjectShaderProgram;
    }

    CreateShader(type, source)
    {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        this.CheckShaderCompile(shader);
        return shader;
    }

    CheckShaderCompile(shader)
    {
        const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (!success)
        {
            const info = this.gl.getShaderInfoLog(shader);
            console.error("shader error", info);
            this.gl.deleteShader(shader);
        }
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
        this.gl.uniformMatrix4fv(this.objectShaderProgram.UniformLoc.uProjectionLoc, false, projection);
    }

    Render(view)
    {
        //this.objectShaderProgram.Use();
        //this.gl.uniformMatrix4fv(this.objectShaderProgram.UniformLoc.uProjectionLoc, false, view);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        //render here:

        this.objectShaderProgram.Use();
        this.gl.bindVertexArray(this.Vao);

        this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);//drawElements(mode, count, type, offset)

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
            quadPos.x, quadPos.y,                               u0, v1, // bottomLeft 
            quadPos.x, quadPos.y + quadSize.y,                  u0, v0, // topLeft 
            quadPos.x + quadSize.x, quadPos.y + quadSize.y,     u1, v0, // topRight 
            quadPos.x + quadSize.x, quadPos.y,                  u1, v1  // bottomRight  
        ]);

        const indices = new Uint16Array
        ([
            0, 1, 2,
            0, 2, 3
        ]);

        this.Vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.Vao);

        const Ebo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, Ebo);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);

        const Vbo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, Vbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        //vertex attribute pointers here
        const stride = 4 * 4; // 4 * sizeof(int) = 4 * 4 

        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, stride, 0);
        this.gl.vertexAttribDivisor(0, 0); // ändra vertex position varje vertex för attrib 0

        this.gl.enableVertexAttribArray(1);
        this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, stride, 2 * 4); //offset = sizeofVector2 
        this.gl.vertexAttribDivisor(1, 0);
    }

}