const CONFIG = {
    shapeSize: 80,
    lineWidth: 4,
    spacing: 180,
    colors: {
        triangle: '#00D2FF',
        pentagon: '#FF2A7A',
        rhombus: '#FFD700', // Previously star color
        square: '#3A86FF'
    }
};

const PathGenerators = {
    regularPolygon: (ctx, size, sides, rotationOffset = -Math.PI / 2) => {
        const radius = size / 2;
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides + rotationOffset;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
    },
    triangle: (ctx, size) => PathGenerators.regularPolygon(ctx, size, 3),
    pentagon: (ctx, size) => PathGenerators.regularPolygon(ctx, size, 5),
    square: (ctx, size) => PathGenerators.regularPolygon(ctx, size, 4, -Math.PI / 4),
    rhombus: (ctx, size) => PathGenerators.regularPolygon(ctx, size, 4) // Default rotation creates a rhombus/diamond
};

const TransformBehaviors = {
    normal: () => {},
    rotate: (state, deltaTime) => {
        state.rotation += 2 * deltaTime;
    },
    translate: (state, deltaTime) => {
        state.time += deltaTime;
        state.offsetX = Math.sin(state.time * 4) * 40;
    },
    scale: (state, deltaTime) => {
        state.time += deltaTime;
        state.scale = 1 + Math.sin(state.time * 4) * 0.4;
    }
};

class Shape {
    constructor(pathId, transformId, color, x, y, size) {
        this.pathGenerator = PathGenerators[pathId];
        this.behavior = TransformBehaviors[transformId];
        this.color = color;
        this.size = size;
        
        this.baseX = x;
        this.baseY = y;

        this.state = {
            offsetX: 0,
            rotation: 0,
            scale: 1,
            time: 0
        };
    }

    update(deltaTime) {
        if (this.behavior) {
            this.behavior(this.state, deltaTime);
        }
    }

    draw(ctx) {
        ctx.save();
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = CONFIG.lineWidth;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.translate(this.baseX + this.state.offsetX, this.baseY);
        ctx.rotate(this.state.rotation);
        ctx.scale(this.state.scale, this.state.scale);

        ctx.beginPath();
        this.pathGenerator(ctx, this.size);
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
    }
}

class CanvasApp {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.shapes = [];
        this.lastTime = 0;
    }

    init() {
        const centerY = this.canvas.height / 2;
        const startX = 130; 
        const { spacing, shapeSize, colors } = CONFIG;

        this.shapes.push(new Shape('triangle', 'normal', colors.triangle, startX, centerY, shapeSize));
        this.shapes.push(new Shape('pentagon', 'rotate', colors.pentagon, startX + spacing, centerY, shapeSize));
        this.shapes.push(new Shape('rhombus', 'translate', colors.rhombus, startX + spacing * 2, centerY, shapeSize));
        this.shapes.push(new Shape('square', 'scale', colors.square, startX + spacing * 3, centerY, shapeSize));

        requestAnimationFrame((time) => this.loop(time));
    }

    loop(currentTime) {
        let deltaTime = (currentTime - this.lastTime) / 1000;
        if (deltaTime > 0.1) deltaTime = 0.1;
        this.lastTime = currentTime;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const shape of this.shapes) {
            shape.update(deltaTime);
            shape.draw(this.ctx);
        }

        requestAnimationFrame((time) => this.loop(time));
    }
}

const app = new CanvasApp('appCanvas');
app.init();