import MathFunctions from "../Core/MathFunctions.js";

export default class Camera
{
    constructor(gl, shaderManager)
    {
        this.gl = gl;
        this.mathFs = new MathFunctions();
        window.addEventListener("resize", this.OnResize.bind(this));
        this.shaderManager = shaderManager;
        this.objectShader = this.shaderManager.Get("object");
        this.enemyShader = this.shaderManager.Get("enemy");

        this.OnResize();
    }

    CameraView(pos)
    {
        const view = new Float32Array
        ([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            pos.x, pos.y, 0, 1
        ]);

        this.objectShader.UniformMatrix4fv(this.objectShader.uView, view);
    }

    OnResize() //fixa
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
        this.objectShader.UniformMatrix4fv(this.objectShader.uProjection, projection);
        this.enemyShader.UniformMatrix4fv(this.enemyShader.uProjection, projection);
    }
}