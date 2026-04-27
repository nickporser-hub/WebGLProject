export default class Mesh
{
    constructor(gl, indices, vertices)
    {
        this.gl = gl;

        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);

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

        this.indexCount = indices.length;
    }

    Bind()
    {
        this.gl.bindVertexArray(this.vao);
    }
    
}