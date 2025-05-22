const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const numObjects = 50;
const objects = [];
let maxDistance = 150;
const collisionDamping = 0.5;
let drawLinesEnabled = true;

const MAX_SPEED = 0.5;
let speedBoostFactor = 1;
let speedBoostDuration = 0;
const BASE_ACCELERATION_FACTOR = 0.0005;

class FlyingObject {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.radius = Math.random() * 5 + 3;
        this.type = 2;
        this.maxSpeed = MAX_SPEED;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        let currentAccelerationFactor = BASE_ACCELERATION_FACTOR;
        if (speedBoostDuration > 0) {
            currentAccelerationFactor = 0.01;
            speedBoostDuration--;
            if (speedBoostDuration === 0) {
                speedBoostFactor = 1;
            }
        }

        this.vx += this.vx * currentAccelerationFactor;
        this.vy += this.vy * currentAccelerationFactor;

        const currentSpeedSq = this.vx * this.vx + this.vy * this.vy;
        const maxSpeedSq = this.maxSpeed * this.maxSpeed;
        if (currentSpeedSq > maxSpeedSq) {
            const currentSpeed = Math.sqrt(currentSpeedSq);
            this.vx = (this.vx / currentSpeed) * this.maxSpeed;
            this.vy = (this.vy / currentSpeed) * this.maxSpeed;
        }

        if (this.x + this.radius > width || this.x - this.radius < 0) this.vx *= -1;
        if (this.y + this.radius > height || this.y - this.radius < 0) this.vy *= -1;
    }

    draw() {
        const sides = 6;
        const angle = (Math.PI * 2) / sides;
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const x = this.x + this.radius * Math.cos(i * angle);
            const y = this.y + this.radius * Math.sin(i * angle);
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        const color = getColor(this.getNearestNeighborDistance());
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    getNearestNeighborDistance() {
        let minDistance = Infinity;
        for (let other of objects) {
            if (other !== this) {
                const dx = this.x - other.x;
                const dy = this.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < minDistance) {
                    minDistance = distance;
                }
            }
        }
        return minDistance;
    }
}

function getColor(distance) {
    const normalizedDistance = Math.min(1, distance / maxDistance);
    const turquoise = [0, 191, 255];
    const blue = [0, 128, 255];
    const darkPurple = [60, 0, 100];

    let r, g, b;
    if (normalizedDistance < 0.33) {
        r = Math.round(turquoise[0] + (blue[0] - turquoise[0]) * normalizedDistance * 3);
        g = Math.round(turquoise[1] + (blue[1] - turquoise[1]) * normalizedDistance * 3);
        b = Math.round(turquoise[2] + (blue[2] - turquoise[2]) * normalizedDistance * 3);
    } else {
        r = Math.round(blue[0] + (darkPurple[0] - blue[0]) * (normalizedDistance - 0.33) * (3 / 0.66));
        g = Math.round(blue[1] + (darkPurple[1] - blue[1]) * (normalizedDistance - 0.33) * (3 / 0.66));
        b = Math.round(blue[2] + (darkPurple[2] - blue[2]) * (normalizedDistance - 0.33) * (3 / 0.66));
    }
    return `rgb(${r}, ${g}, ${b})`;
}

function drawLines() {
    if (drawLinesEnabled) {
        for (let i = 0; i < numObjects; i++) {
            for (let j = i + 1; j < numObjects; j++) {
                const obj1 = objects[i];
                const obj2 = objects[j];
                const dx = obj1.x - obj2.x;
                const dy = obj1.y - obj2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.moveTo(obj1.x, obj1.y);
                    ctx.lineTo(obj2.x, obj2.y);
                    ctx.strokeStyle = getColor(distance);
                    ctx.lineWidth = 0.5;
                    ctx.globalAlpha = 0.7;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }
}

function handleCollisions() {
    for (let i = 0; i < numObjects; i++) {
        for (let j = i + 1; j < numObjects; j++) {
            const obj1 = objects[i];
            const obj2 = objects[j];
            const dx = obj2.x - obj1.x;
            const dy = obj2.y - obj1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < obj1.radius + obj2.radius) {
                const collisionAngle = Math.atan2(dy, dx);
                const obj1Velocity = Math.sqrt(obj1.vx * obj1.vx + obj1.vy * obj1.vy);
                const obj2Velocity = Math.sqrt(obj2.vx * obj2.vx + obj2.vy * obj2.vy);

                const obj1Angle = Math.atan2(obj1.vy, obj1.vx);
                const obj2Angle = Math.atan2(obj2.vy, obj2.vx);

                const newObj1Vx = obj2Velocity * Math.cos(obj2Angle - collisionAngle) * Math.cos(collisionAngle) + obj1Velocity * Math.sin(obj1Angle - collisionAngle) * Math.cos(collisionAngle + Math.PI / 2);
                const newObj1Vy = obj2Velocity * Math.cos(obj2Angle - collisionAngle) * Math.sin(collisionAngle) + obj1Velocity * Math.sin(obj1Angle - collisionAngle) * Math.sin(collisionAngle + Math.PI / 2);
                const newObj2Vx = obj1Velocity * Math.cos(obj1Angle - collisionAngle) * Math.cos(collisionAngle) + obj2Velocity * Math.sin(obj2Angle - collisionAngle) * Math.cos(collisionAngle + Math.PI / 2);
                const newObj2Vy = obj1Velocity * Math.cos(obj1Angle - collisionAngle) * Math.sin(collisionAngle) + obj2Velocity * Math.sin(obj2Angle - collisionAngle) * Math.sin(collisionAngle + Math.PI / 2);

                obj1.vx = newObj1Vx * collisionDamping;
                obj1.vy = newObj1Vy * collisionDamping;
                obj2.vx = newObj2Vx * collisionDamping;
                obj2.vy = newObj2Vy * collisionDamping;

                const overlap = obj1.radius + obj2.radius - distance;
                const moveX = overlap * Math.cos(collisionAngle) * 0.5;
                const moveY = overlap * Math.sin(collisionAngle) * 0.5;

                obj1.x -= moveX;
                obj1.y -= moveY;
                obj2.x += moveX;
                obj2.y += moveY;
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    objects.forEach(obj => {
        obj.update();
        obj.draw();
    });

    drawLines();
    handleCollisions();
}

for (let i = 0; i < numObjects; i++) {
    objects.push(new FlyingObject());
}

animate();

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});