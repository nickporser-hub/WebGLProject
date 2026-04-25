export default class TextureLoader
{
    constructor(gl)
    {
        this.gl = gl;
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

            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST); 
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST); 
        };

        return texture;
    }
}