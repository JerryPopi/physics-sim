import Vector2 from "./Vector.js";

export default class Particle {
	constructor(x, y, w, h) {
		this.x  = x;
		this.y  = y;
		this.w  = w;
		this.h  = h;
		this.velocity = new Vector2().fill(Math.random());
		this.mass = 1;
	}

	midpoint() {
		return new Vector2(this.x + this.w/2, this.y + this.h/2);
	}
}