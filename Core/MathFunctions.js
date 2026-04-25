export default class MathFunctions // matematiska funktioner inte inbyggda i javascript 
{
    Vec2(x, y)
    {
        return {x, y};
    }

    Vec2Add(a, b)
    {
        return this.Vec2(a.x + b.x, a.y + b.y);
    }

    Vec2Subtract(a, b)
    {
        return this.Vec2(a.x - b.x, a.y - b.y);
    }

    Vec2Multiply(a, b)
    {
        return this.Vec2(a.x * b.x, a.y * b.y);
    }

    Vec2Divide(a, b)
    {
        return this.Vec2(a.x / b.x, a.y / b.y);
    }
}