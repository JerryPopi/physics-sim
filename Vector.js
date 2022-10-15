export default class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(vec) {
		return new Vector2(this.x + vec.x, this.y + vec.y);
	}

	mag() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}

	fill(val) {
		this.x = val;
		this.y = val;
		return this;
	}
}