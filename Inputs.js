export default class Inputs
{
    constructor()
    {
        this.keysDown = new Set();
        this.keysPressed = new Set();
        this.buttonsDown = new Set();
        this.buttonsPressed = new Set();

        window.addEventListener("keydown", (e) =>
        {
            let key = e.key.toLowerCase();
            if (!this.keysDown.has(key))
                this.keysPressed.add(key); 
            this.keysDown.add(key);
        });

        window.addEventListener("keyup", (e) => 
        {
            this.keysDown.delete(e.key.toLowerCase());
        });

        window.addEventListener("mousedown", (e) => 
        {
            if (!this.buttonsDown.has(e.button))
                this.buttonsPressed.add(e.button);
            this.buttonsDown.add(e.button);
        });

        window.addEventListener("mouseup", (e) => 
        {
            this.buttonsDown.delete(e.button);
        });
    } 
    
    IsKeyDown(key)
    {
        return this.keysDown.has(key);
    }
    IsKeyPressed(key)
    {
        return this.keysPressed.has(key);
    }
    IsButtonDown(button)
    {
        return this.buttonsDown.has(button);
    }
    IsButtonPressed(button)
    {
        return this.buttonsPressed.has(button);
    } 

    FixedUpdate()
    {
        this.keysPressed.clear();
        this.buttonsPressed.clear();
    }
}