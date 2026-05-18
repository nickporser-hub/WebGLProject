import TextureCoords from "../../Renderer/TextureCoords.js";
import MathFunctions from "../Core/MathFunctions.js";

export default class
{
    constructor()
    {
        this.mathFs = new MathFunctions();
        this.birdTextureCoords = new TextureCoords(this.mathFs.Vec2(288, 288), this.mathFs.Vec2(48, 48));
        
        this.start = true;
        this.startUV = 0;
        this.iterations = 0;
        this.index = [0];
    }

    BirdAnimationIndex(uvIndex, iterations)
    {
        if (this.iterations == iterations)
        {
            if (this.index[0] % 5 == 0 && this.index[0] != uvIndex)
            {
                this.index[0] = this.startUV;
            }
            else
            {
                this.index[0]++;
            }
            this.iterations = 0;
        }
        this.iterations++;
        
        return this.index;
    }

    StartUV(uvIndex)
    {
        if (this.start)
            this.startUV = uvIndex;
        this.start = false;
    }

    BirdAnimation(uvIndex, amount, iterations)
    { 
        this.StartUV(uvIndex);
        const index = this.BirdAnimationIndex(uvIndex, iterations);
        const coords = this.birdTextureCoords.GetUV(index, amount);
        return coords;
    }
}