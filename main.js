const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;
canvas.style.backgroundColor = "black";

let x = canvas.width / 2;
let y = canvas.height / 2;
let dx = 4;
let dy = 4;
const radius = 80;
const sides = 8;
let rotation = 0;
let color = "red";

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function animate() {
    requestAnimationFrame(animate);

    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI / sides) - (Math.PI / 2) + rotation;
        const px = x + radius * Math.cos(angle);
        const py = y + radius * Math.sin(angle);

        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.closePath();
    
    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    ctx.stroke();

    if (x + radius > canvas.width || x - radius < 0) {
        dx = -dx;
        color = getRandomColor();
    }
    
    if (y + radius > canvas.height || y - radius < 0) {
        dy = -dy;
        color = getRandomColor();
    }

    x += dx;
    y += dy;
    rotation += 0.05;
}

animate();