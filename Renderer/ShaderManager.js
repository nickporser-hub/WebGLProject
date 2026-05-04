import Shader from "./Shader.js";
import ShaderSources from "../Resources/ShaderSources.js";

export default class ShaderManager//skapar shader
{
    constructor(gl)
    {
        this.gl = gl;
        this.shaders = new Map();
        const sources = new ShaderSources();

        this.Create("object", sources.objectVertexShaderSource, sources.fragmentShaderSource);
        this.Create("enemy", sources.objectVertexShaderSource, sources.fragmentShaderSource);
    }

    Create(name, vertexShader, fragmentShader)
    {
        const shader = new Shader(this.gl, vertexShader, fragmentShader);
        this.shaders.set(name, shader);
        return shader;
    }

    Get(name)
    {
        const shader = this.shaders.get(name);

        if (!shader) {
            throw new Error(`Shader '${name}' not found`);
        }

        return shader;
    }

}