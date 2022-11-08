class Canvas {
    /**
     * @param {HTMLCanvasElement} canvas The HTMLElement of the canvas 
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "400 500px sans-serif";
    }
    
    /**
     * Refreshes the canvas
     */
    refresh() {
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "hsla(0, 0%, 25%, 60%)";
        this.ctx.fillText(player.points, this.canvas.width/2, this.canvas.height/2);

    }

    /**
     * Draws a rectangle on the canvas
     * 
     * @param {{x: Number, y: Number}} xy The position of the rectangle
     * @param {{w: Number, h: Number}} wh The size of the rectangle
     * @param {String} fill The hexadecimal fill colour of the rectangle
     */
    drawRect(xy, wh, fill) {
        this.ctx.beginPath();
        this.ctx.fillStyle = fill;
        this.ctx.fillRect(xy.x, xy.y, wh.w, wh.h);
    }

    /**
     * Draws a line on the canvas
     * 
     * @param {{x: Numbher, y: Number}} xyo The starting position of the line
     * @param {{x: Number, y: Number}} xyf The end position of the line
     * @param {Number} width The width of the line
     * @param {String} stroke The hexadecimal stroke colour of the line
     */
    drawLine(xyo, xyf, width, stroke) {
        this.ctx.beginPath();
        this.ctx.moveTo(xyo.x, xyo.y);
        this.ctx.lineTo(xyf.x, xyf.y);
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = stroke;
        this.ctx.stroke();
    }

    /**
     * Draws a circle on the canvas
     * 
     * @param {{x: Number, y: Number}} xy The position of the circle
     * @param {Number} r The radius of the circle
     * @param {{o: Number, f: Number}} a The start and end angle of the circle in radians
     * @param {String} fill The hexadecimal fill colour of the circle
     * @param {String} stroke The hexadecimal stroke colour of the circle
     * @param {Number} width The width of the circunference
     */
    drawCircle(xy, r, a, fill = null, stroke = null, width = null) {
        this.ctx.beginPath();
        this.ctx.arc(xy.x, xy.y, r, a.o, a.f);
        if (fill) {
            this.ctx.fillStyle = fill;
            this.ctx.fill()
        }
        if (stroke) {
            if (width) {
                this.ctx.lineWidth = width;
            }
            this.ctx.strokeStyle = stroke;
            this.ctx.stroke();
        }
    }
}

class Player {
    constructor() {
        this.points = 0;
    }
}

class Tank {
    /**
     * @param {HTMLCanvasElement} canvas The HTMLElement of the canvas
     * @param {Player} player The player
     * @param {{x: Number, y: Number}} xy TYhe position of the tank
     */
    constructor(canvas, player, xy) {
        this.canvas = canvas;
        this.player = player;
        this.xy = xy;
        this.cxy = {x: this.xy.x+50, y: this.xy.y+38};
        this.r = 0;
        this.a = 0;
    }

    /**
     * Draws the tank on the canvas
     */
    draw() {
        this.canvas.drawRect({x: this.xy.x, y: this.xy.y}, {w: 100, h: 25}, "#518261");
        this.canvas.drawRect({x: this.xy.x, y: this.xy.y+50}, {w: 100, h: 25}, "#518261");
        this.canvas.drawRect({x: this.xy.x+10, y: this.xy.y}, {w: 80, h: 70}, "#518261");
        this.canvas.drawCircle(this.cxy, 25, {o: 0, f: Math.PI*2}, "#a76745");
        this.canvas.drawLine(this.cxy,
                             {
                                x: this.cxy.x+100*Math.cos(this.r),
                                y: this.cxy.y+100*Math.sin(this.r)
                            },
                            8, "#a76745");
    }

    /**
     * Shoots a proyectile from the cannon
     */
    shoot() {
        proyectiles.push(new Proyectile(this.canvas,
                                        this,
                                        Object.create({
                                            x: this.cxy.x+100*Math.cos(this.r),
                                            y: this.cxy.y+100*Math.sin(this.r)}),
                                        {x: Math.cos(this.r), y: Math.sin(this.r)}));
    }
}

class Proyectile {
    /**
     * @param {HTMLCanvasElement} canvas The HTMLElement of the canvas
     * @param {Tank} tank The tank of the proyectile
     * @param {{x: Number, y: Number}} xy The position of the proyectile
     * @param {{x: Number, y: Number}} vxy The velocity of the proyectile
     */
    constructor(canvas, tank, xy, vxy) {
        this.canvas = canvas;
        this.tank = tank;
        this.xy = xy;
        this.vxy = vxy;
    }

    /**
     * Draws the proyectile on the canvas
     */
    draw() {
        this.canvas.drawCircle(this.xy, 5, {o: 0, f: Math.PI*2}, `hsl(${Math.asin(this.vxy.x)*180/Math.PI}, 100%, 50%)`);
    }

    /**
     * Moves the proyectile
     */
    move() {
        this.xy.x += this.vxy.x;
        this.xy.y += this.vxy.y;
    }

    /**
     * Checks if the proyectile is outside the canvas or colliding with an enemy
     */
    checkColls() {
        let collided = false;
        for (let i = 0; i < enemies.length && !collided; i++) {
            let d = Math.sqrt(Math.pow(enemies[i].xy.x-this.xy.x ,2) + Math.pow(enemies[i].xy.y-this.xy.y, 2));
            if (d < 25) {
                collided = true;
                enemies.splice(enemies.indexOf(enemies[i]), 1);
                tank.player.points++;
            }
        }

        if (this.xy.x < 0 || this.xy.x > this.canvas.width || this.xy.y < 0 || this.xy.y > this.canvas.height || collided) {
            proyectiles.splice(proyectiles.indexOf(this), 1);
        }
    }
}

class Enemy {
    /**
     * @param {HTMLCanvasElement} canvas The HTMLElement of the canvas
     * @param {{x: Number, y: Number}} xy The position of the enemy
     */
    constructor(canvas, xy) {
        this.canvas = canvas;
        this.xy = xy;
    }

    /**
     * Draws the enemy on the canvas
     */
    draw() {
        this.canvas.drawCircle(this.xy, 20, {o: 0, f: Math.PI*2}, "#f00");
    }
}

function keydown(e) {
    let key = e.code;
    if (!map.includes(key))
        map.push(key);

    if (map.includes("ArrowLeft")) {
        tank.a -= 2;
    } else if (map.includes("ArrowRight")) {
        tank.a += 2;
    }
    // Recalculate the angle of the tank in radians
    tank.r = tank.a*Math.PI/180;
    
    if (map.includes("Space")) {
        tank.shoot();
    }
}

function keyup(e) {
    map = [];
}


function cycle() {
    canvas.refresh();
    tank.draw();

    proyectiles.forEach(proyectile => {
        proyectile.move();
        proyectile.draw();
        proyectile.checkColls();
    });

    enemies.forEach(enemy => {
        enemy.draw();
    });
}

/**
 * Spawns an enemy, if there aren't more than 5
 * @param {{x: Number, y: Number, w: Number, h: Number}} bound The area the enemy can spawn at
 */
function spawnEnemy(bound) {
    if (enemies.length < 5) {
        enemies.push(new Enemy(canvas, {x: Math.random()*(bound.w-bound.x)+bound.x, y: Math.random()*(bound.h-bound.y)+bound.y}));
    }
}


let map = []; // Used for storing key events

let proyectiles = [];
let enemies = [];

let canvas = new Canvas(document.getElementById("canvas"));
let player = new Player();
let tank = new Tank(canvas, player, {x: 100, y: canvas.canvas.height/2-75});
// Autospawn an enemy
spawnEnemy({x: 300, y: 0, w: canvas.canvas.width-20, h: canvas.canvas.height-20});
// Main interval
setInterval(cycle, 10);

// Enemy spawner interval
setInterval(() => spawnEnemy({x: 300, y: 0, w: canvas.canvas.width-20, h: canvas.canvas.height-20}), 5000);

addEventListener("keydown", keydown);
addEventListener("keyup", keyup);