export default class MathFunctions // matematiska funktioner inte inbyggda i javascript 
{
    Vec2(x, y)
    {
        return {x, y};
    }

    Add(a, b)
    {
        return this.Vec2(a.x + b.x, a.y + b.y);
    }

    Subtract(a, b)
    {
        return this.Vec2(a.x - b.x, a.y - b.y);
    }

    Multiply()
    {
        return this.Vec2(a.x * b.x, a.y * b.y);
    }

    Divide()
    {
        return this.Vec2(a.x / b.x, a.y / b.y);
    }
}