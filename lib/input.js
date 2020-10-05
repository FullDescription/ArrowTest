class Mouse
{
	constructor()
	{
		this.x = 0;
		this.y = 0;
		this.buttons = ["left", "middle", "right", "button4", "button5"]

		addEventListener("mousemove", e =>
		{
			this.x = e.clientX;
			this.y = e.clientY;
		})
		addEventListener("mousedown", e =>
		{
			this[this.buttons[e.button]] = true;
		})
		addEventListener("mouseup", e =>
		{
			this[this.buttons[e.button]] = false;
		})
	}
	get(button)
	{
		return this[button] === undefined ? false : this[button]
	}
}

class Keyboard
{
	constructor()
	{
		addEventListener("keydown", e =>
		{
			this[e.key] = true;
		})
		addEventListener("keyup", e =>
		{
			this[e.key] = false;
		})
	}
	get(key)
	{
		return this[key] === undefined ? false : this[key]
	}
}