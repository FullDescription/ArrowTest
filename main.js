// Get canvas context
let ctx = document.getElementById("ctx").getContext("2d");
ctx.refresh = function()
{
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.setTransform(1, 0, 0, 1, 0, 0);
	this.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.transform(1, 0, 0, -1, this.canvas.width / 2, this.canvas.height / 2);
}

// Get input objects
let mouse = new Mouse();
let keyboard = new Keyboard();

// Time object
let time = {
	start: Date.now(),
	now: 0,
	delta: 0,
	update: function()
	{
		let now = Date.now() - this.start;
		this.delta =  now - this.now;
		this.now = now;
	}
}

// Draw arrow trajectory
function trajectory(r0, v0, g)
{
	let x = r0.x, y = r0.y, t = 0;
	while (Math.abs(x) <= ctx.canvas.width / 2 + 200 && Math.abs(y) <= ctx.canvas.height / 2 + 200 && t < 100)
	{
		x = r0.x + v0.x * t;
		y = r0.y + v0.y * t - g/2 * t**2;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x, y);
		ctx.stroke();
		t += 1;
	}
}

// Foda-se
let target = new Path
(
	[true, new Vector2(-10, 50)],
	[false, new Vector2(-10, -50)],
	[false, new Vector2(10, -50)],
	[false, new Vector2(10, 50)],
	[false, new Vector2(-10, 50)]
)

// Create arrow
let arrow = new Path
(
	[true, new Vector2(-50, 0)],
	[false, new Vector2(50, 0)],
	[false, new Vector2(30, 20)],
	[true, new Vector2(50, 0)],
	[false, new Vector2(30, -20)]
)
arrow.mode = 0;
arrow.vel = new Vector2(0, 0);

function frame()
{
	// Refresh canvas
	time.update();
	ctx.refresh();

	// Update stroke style
	ctx.lineWidth = "4";
	ctx.lineCap = "round";
	ctx.lineJoin = "round";

	// Get arrow mode
	switch(arrow.mode)
	{
		// Rotate towards mouse
		case 0:
			let dv = new Vector2(mouse.x - ctx.canvas.width/2, ctx.canvas.height/2 - mouse.y).normalize().scale(100);
			arrow.vel = arrow.vel.add(dv.sub(arrow.vel).scale(time.delta / 40))
			arrow.u = arrow.vel.normalize();
			arrow.v = arrow.u.normalLeft();
			/* Unused - Arrow rotation lock
			let a = u1 < 0 || u2 < -sqrt2/2;
			let b = u1 > u2;
			u1 = a ? (b ? sqrt2/2 : 0) : u1;
			u2 = a ? (b ? -sqrt2/2 : 1) : u2;
			*/

			arrow.mode = mouse.get("left") ? 1 : 0;
			break;

		// Rotation/Pull transition
		case 1:
			arrow.init = new Vector2(mouse.x, mouse.y);

			arrow.mode = 2;
			break;

		// Pull arrow
		case 2:
			arrow.proj = (mouse.x - arrow.init.x) * arrow.u.x + (arrow.init.y - mouse.y) * arrow.u.y;
			arrow.proj = arrow.proj < 0 ? arrow.proj : 0;
			arrow.vel = arrow.u.scale(arrow.proj / -10);
			arrow.w = arrow.u.scale(arrow.proj / 5);
			ctx.strokeStyle = "gray";
			trajectory(arrow.w, arrow.vel, 3);

			arrow.mode = mouse.get("left") ? 2 : 3;
			break;

		// Launch arrow
		case 3:
			arrow.vel.y -= 3 * time.delta / 40;
			arrow.w = arrow.w.add(arrow.vel.scale(time.delta / 40));
			arrow.u = arrow.vel.normalize();
			arrow.v = arrow.u.normalLeft();

			arrow.mode = Math.abs(arrow.w.x) > ctx.canvas.width / 2 + 200 || Math.abs(arrow.w.y) > ctx.canvas.height / 2 + 200 ? 4 : 3;
			break;

		// Return arrow
		case 4:
			arrow.vel = arrow.w.scale(-time.delta / 40);
			arrow.w = arrow.w.add(arrow.vel.scale(time.delta / 40))
			arrow.u = arrow.vel.normalize();
			arrow.v = arrow.u.normalLeft();

			arrow.mode = Math.floor(Math.abs(arrow.w.x)) == 0 && Math.floor(Math.abs(arrow.w.y)) == 0 ? 5 : 4;
			break;

		// Reset arrow
		case 5:
			arrow.w = new Vector2(0, 0);
			arrow.vel = arrow.vel.normalize().scale(100)
			arrow.mode = 0;
			break;
	}
	
	// Draw arrow
	ctx.strokeStyle = "black";
	arrow.draw();
	
	// Target
	target.w.x = ctx.canvas.width / 2 - 100;
	target.draw();

	// Request next frame 
	requestAnimationFrame(frame);
}

// Request first frame
frame();