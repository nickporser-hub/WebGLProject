export default class TextureCoords
{
    constructor(SheetSize, TileSize)
    {
        this.sheetSize = SheetSize;
        this.tileSize = TileSize;
    }

    GetUV(Index, amount)
    {
        let u0 = [];
        let v0 = [];
        let u1 = [];
        let v1 = [];

        const texturesPerRow = this.sheetSize.x / this.tileSize.x;

        for (let i = 0; i < amount; i++)
        {
            //UV matte
            let index = Index[0];

            let tileX = index % texturesPerRow;
            let tileY = Math.floor(index / texturesPerRow);

            u0.push(tileX * this.tileSize.x / this.sheetSize.x);
            v0.push(tileY * this.tileSize.y / this.sheetSize.y);

            u1.push((tileX + 1) * this.tileSize.x / this.sheetSize.x);
            v1.push((tileY + 1) * this.tileSize.y / this.sheetSize.y);
            //
        }

        return {U0: u0, V0: v0, U1: u1, V1: v1};
    }
}