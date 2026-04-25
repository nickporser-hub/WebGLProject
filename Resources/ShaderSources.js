export default class ShaderSources
{
    constructor()
    {
        this.objectVertexShaderSource = `#version 300 es

            layout(location = 0) in vec2 aPosition;
            layout(location = 1) in vec2 aUV;

            out vec2 vUV; 

            uniform mat4 uProjection;
            uniform mat4 uView;

            void main()
            {
                gl_Position = uView * uProjection * vec4(aPosition, 0.0, 1.0);
                vUV = aUV;
            }
        `;
        this.fragmentShaderSource = `#version 300 es
            
            precision mediump float;

            in vec2 vUV; 
            out vec4 FragColor;

            uniform sampler2D uTexture;

            void main()
            {
                FragColor = texture(uTexture, vUV);
            }
        `;
    }
}