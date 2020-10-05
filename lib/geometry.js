class Vector2
{
    constructor(x, y)
    {
		this.x = x;
		this.y = y;
	}
    normalize()
    {
		let len = (this.x**2 + this.y**2)**(1/2);
		return new Vector2(this.x / len, this.y / len);
	}
    transform(u, v, w)
    {
		return new Vector2(this.x * u.x + this.y * v.x + w.x, this.x * u.y + this.y * v.y + w.y);
	}
    normalLeft()
    {
		return new Vector2(-this.y, this.x)
	}

    add(v)
    {
		return new Vector2(this.x + v.x, this.y + v.y)
	}
    sub(v)
    {
		return new Vector2(this.x - v.x, this.y - v.y)
	}
    scale(factor)
    {
		return new Vector2(this.x * factor, this.y * factor);
	}
}


class Path {
    constructor(...base)
    {
		this.base = base
		this.u = new Vector2(1, 0);
		this.v = new Vector2(0, 1);
		this.w = new Vector2(0, 0);
	}

    draw()
    {
		ctx.beginPath();
        for (let point of this.base)
        {
			point = point[1].transform(this.u, this.v, this.w);
            if(point[0])
            {
				ctx.moveTo(point.x, point.y)
            }
            else
            {
				ctx.lineTo(point.x, point.y)
			}
		}
		ctx.stroke();
	}
}