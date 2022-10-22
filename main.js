import Particle from './Particle.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.height = document.body.clientHeight;
canvas.width  = document.body.clientWidth

const g = 0.981;
const psz = 30;
const windSpeed = 0.1;
const pColor = '#A020F0';

let mouseX, mouseY, mouseDownX, mouseDownY, dragging;

let particles = [];

const spawnParticles = (count = 10) => {
	for (let i = 0; i < count; i++) {
		particles.push(new Particle(Math.random() * 500, Math.random() * 500, psz, psz));
	}
};

spawnParticles();

const particleCountInput = document.getElementById('particleCount');
particleCountInput.addEventListener('change', () => spawnParticles(particleCountInput.value));

function clamp(min, max, val) {
	return Math.min(Math.max(val, min), max);
}

let lastTick = performance.now();
function tick(nowish) {
	window.requestAnimationFrame(tick);
	const delta = nowish - lastTick;
	lastTick = nowish;

	applyVelocity(delta);

	draw();
	checkCollisions();
}

window.requestAnimationFrame(tick);

canvas.addEventListener('mousedown', (e) => {
	dragging = true;
	getMouseDownPos(e);
});

canvas.addEventListener('mouseup', () => {
	dragging = false;
	const factor = document.getElementById('accelFactor').value;
	particles.forEach(p => {
		p.velocity.x += (mouseX - mouseDownX) / factor;
		p.velocity.y += (mouseY - mouseDownY) / factor;
	});
});

canvas.addEventListener('mousemove', (e) => {
	const rect = canvas.getBoundingClientRect();
	mouseX = e.clientX - rect.left;
	mouseY = e.clientY - rect.top;
});

async function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = pColor;
	particles.forEach(p => {
		ctx.fillRect(p.x, p.y, p.w, p.h);

		// TODO: maybe add checkboxes to toggle
		drawVector(p.midpoint().x, p.midpoint().y, p.midpoint().x + p.velocity.x * p.velocity.mag() * 100, p.midpoint().y + p.velocity.y * p.velocity.mag() * 100);
	});

	if(dragging) drawVectorToMouse();
}

function checkCollisions() {
	// windspeed here is not used properly, but its used as a constant for slowing down.
	// in future it should act all the time, e.g x += windspeed * delta

	particles.forEach(p => {
		if(p.x >= canvas.width - psz) {
			p.x = canvas.width - psz;
			p.velocity.x *= - (1 - windSpeed);
		}
		if(p.x <= 0) {
			p.x = 0;
			p.velocity.x *= - (1 - windSpeed);
		}
		if(p.y >= canvas.height - psz) {
			p.y = canvas.height - psz;
			p.velocity.y *= - (1 - windSpeed);
		}
		if(p.y <= 0) {
			p.y = 0;
			p.velocity.y *= - (1 - windSpeed);
		}

		particles.forEach(p2 => {
			if(p.x == p2.x && p.y == p2.y) return;
			if((p.x >= p2.x && p.x <= p2.x + psz) && (p.y >= p2.y && p.y <= p2.y + psz)) {
				p.velocity.x *= -1;
				p.velocity.y *= -1;
				p2.velocity.x *= -1;
				p2.velocity.y *= -1;
			}
		});
	});
}

function applyVelocity(delta) {
	particles.forEach(p => {
		p.x += p.velocity.x * delta;
		p.y += p.velocity.y * delta;
	});
}

function getMouseDownPos(e){
	const rect = canvas.getBoundingClientRect();
	mouseDownX = e.clientX - rect.left;
	mouseDownY = e.clientY - rect.top;
}

function drawVectorToMouse() {
	drawVector(mouseDownX, mouseDownY, mouseX, mouseY);
}

function drawVector(fromx, fromy, tox, toy){

	// TODO: calculate speed and change color accordingly

	//variables to be used when creating the arrow
	const width = 3;
	var headlen = 10;
	// This makes it so the end of the arrow head is located at tox, toy, don't ask where 1.15 comes from
	var angle = Math.atan2(toy-fromy,tox-fromx);
	tox -= Math.cos(angle) * ((width*1.15));
	toy -= Math.sin(angle) * ((width*1.15));

	// Color based on size
	const length = Math.sqrt(Math.pow(tox-fromx, 2), Math.pow(toy-fromy, 2));
	const hue = clamp(0, 120, 120 - Math.floor((100 - length) * 120 / 100));


	//starting path of the arrow from the start square to the end square and drawing the stroke
	ctx.beginPath();
	ctx.moveTo(fromx, fromy);
	ctx.lineTo(tox, toy);
	// ctx.strokeStyle = "#00cc00";
	ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
	ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

	ctx.lineWidth = width;
	ctx.stroke();

	//starting a new path from the head of the arrow to one of the sides of the point
	ctx.beginPath();
	ctx.moveTo(tox, toy);
	ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));
	//path from the side point of the arrow, to the other side point
	ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));
	//path from the side point back to the tip of the arrow, and then again to the opposite side point
	ctx.lineTo(tox, toy);
	ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));
	//draws the paths created above
	ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
	ctx.lineWidth = width;
	ctx.stroke();
	ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
	ctx.fill();

	// Reset color to pColor
	ctx.fillStyle = pColor;
}