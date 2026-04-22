export default class Shader 
{
    constructor(gl, vertexShaderSource, fragmentShaderSource)
    {
        this.gl = gl;

        const vertexShader = this.CreateShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.CreateShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        this.program = this.CreateObjectShader(vertexShader, fragmentShader);

        this.uTexture = this.shaderUniformLoc("uTexture");
        this.uView = this.shaderUniformLoc("uView");
        this.uProjection = this.shaderUniformLoc("uProjection");

        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader); // delete shaders de sparas i shaderPrograms
    }

    shaderUniformLoc(name)
    {
        return this.gl.getUniformLocation(this.program, name);
    }

    CreateObjectShader(vertexShader, fragmentShader)
    {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        return program;
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

    Use()
    {
        this.gl.useProgram(this.program);
    }
}