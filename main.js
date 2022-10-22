import Particle from './Particle.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.height = 1000;
canvas.width  = 1000;

const g = 0.981;
const psz = 30;
const windSpeed = 0.1;

let mouseX, mouseY, mouseDownX, mouseDownY, dragging;

let particles = [];

let particle = new Particle(0, 0, psz, psz);
particle.velocity.x *= .5;

particles.push(particle);

let lastTick = performance.now();
function tick(nowish) {
	window.requestAnimationFrame(tick);
	const delta = nowish - lastTick;
	lastTick = nowish;

	applyVelocity(delta);

	draw();

	checkBorderCollisions();
}

window.requestAnimationFrame(tick);

canvas.addEventListener('mousedown', (e) => {
	dragging = true;
	getMouseDownPos(e);
});

canvas.addEventListener('mouseup', () => {
	dragging = false;
	const factor = document.getElementById('accelFactor').value;
	particle.velocity.x = (mouseX - mouseDownX) / factor;
	particle.velocity.y = (mouseY - mouseDownY) / factor;
});

canvas.addEventListener('mousemove', (e) => {
	const rect = canvas.getBoundingClientRect();
	mouseX = e.clientX - rect.left;
	mouseY = e.clientY - rect.top;
});

async function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = '#cc0000';
	ctx.fillRect(particle.x, particle.y, particle.w, particle.h);

	if(dragging) {
		drawVectorToMouse();
	}

	// TODO: maybe add checkboxes to toggle
	drawVector(particle.midpoint().x, particle.midpoint().y, particle.midpoint().x + particle.velocity.x * particle.velocity.mag() * 100, particle.midpoint().y + particle.velocity.y * particle.velocity.mag() * 100);
}

function checkBorderCollisions() {
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
	});
}

function applyVelocity(delta) {
	particle.x += particle.velocity.x * delta;
	particle.y += particle.velocity.y * delta;
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


	//starting path of the arrow from the start square to the end square and drawing the stroke
	ctx.beginPath();
	ctx.moveTo(fromx, fromy);
	ctx.lineTo(tox, toy);
	ctx.strokeStyle = "#00cc00";
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
	ctx.strokeStyle = "#00cc00";
	ctx.lineWidth = width;
	ctx.stroke();
	ctx.fillStyle = "#00cc00";
	ctx.fill();
}