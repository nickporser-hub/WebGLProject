export default class QuadBatchBuilder
{
    constructor()
    {

    }

    CreateEnemyRender(enemies, UVs)
    {
        let vertices = []; // vertices för quadsen
        let indices = []; // ordern för vertices

        const scale = 2; // skala för quaden
        const positions = enemies.Positions;
        const amount = enemies.Amount;
        const quadSize = enemies.QuadSize;

        for (let i = 0; i < amount; i++)
        {
            let u0 = UVs.U0[i];
            let v0 = UVs.V0[i];
            let u1 = UVs.U1[i];
            let v1 = UVs.V1[i];

            let enemyPos = positions[i]; // enemypositions
            
            vertices.push(enemyPos.x, enemyPos.y, u0, v0);                          // bottomLeft 
            vertices.push(enemyPos.x, enemyPos.y + quadSize.y, u1, v0);             // topLeft 
            vertices.push(enemyPos.x + quadSize.x, enemyPos.y + quadSize.y, u1, v1);// topRight 
            vertices.push(enemyPos.x + quadSize.x, enemyPos.y, u0, v1);             // bottomRight 

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