export default class QuadBatchBuilder
{
    constructor()
    {

    }

    CreateQuadBatch(objekt, UVs)
    {
        let vertices = []; // vertices för quadsen
        let indices = []; // ordern för vertices

        const scale = 2; // skala för quaden
        const positions = objekt.Positions;
        const amount = objekt.Amount;
        const quadSize = objekt.QuadSize;

        for (let i = 0; i < amount; i++)
        {
            let u0 = UVs.U0[i];
            let v0 = UVs.V0[i];
            let u1 = UVs.U1[i];
            let v1 = UVs.V1[i];

            let quadPos = positions[i]; // positions
            
            vertices.push(quadPos.x, quadPos.y, u0, v0);                          // bottomLeft 
            vertices.push(quadPos.x, quadPos.y + quadSize.y, u1, v0);             // topLeft 
            vertices.push(quadPos.x + quadSize.x, quadPos.y + quadSize.y, u1, v1);// topRight 
            vertices.push(quadPos.x + quadSize.x, quadPos.y, u0, v1);             // bottomRight 

            let vertexIndex = i * 4; 

            indices.push(0 + vertexIndex);
            indices.push(1 + vertexIndex);
            indices.push(2 + vertexIndex);
            indices.push(0 + vertexIndex);
            indices.push(2 + vertexIndex);
            indices.push(3 + vertexIndex);
        }
        return {Vertices: vertices, Indices: indices};
    }
    
}