const canvas = document.getElementById("canvas");
const scene = canvas.getContext("2d");

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.keys = [];
        this.collisions = [];
        this.sprite = new Image();
        this.sprite.src = "player.png";
        this.speed = 8;
        this.updateKey = this.updateKey.bind(this);
        this.releaseKey = this.releaseKey.bind(this);
        this.move = this.move.bind(this);
        this.draw = this.draw.bind(this);
        this.checkForCollisions = this.checkForCollisions.bind(this);
    }
    updateKey(event) {
        this.keys[event.key] = true;
        event.preventDefault();
    }
    releaseKey(event) {
        this.keys[event.key] = false;
    }
    move() {
        obstacles.forEach(this.checkForCollisions);
        if (this.collisions.length == 0) {
            if (this.keys["ArrowUp"]) {
                this.y -= this.speed;
            }
            if (this.keys["ArrowDown"]) {
                this.y += this.speed;
            }
            if (this.keys["ArrowLeft"]) {
                this.x -= this.speed;
            }
            if (this.keys["ArrowRight"]) {
                this.x += this.speed;
            }
        }
    }
    checkForCollisions(obstacle) {
        if (this.y - this.speed > obstacle.south ||
            this.y + this.speed < obstacle.north ||
            this.x - this.speed > obstacle.east ||
            this.x + this.speed < obstacle.west) {
            this.collisions.push(obstacle);
        }
        if (this.y - this.speed < obstacle.south ||
            this.y + this.speed > obstacle.north ||
            this.x - this.speed < obstacle.east ||
            this.x + this.speed > obstacle.west) {
            this.collisions.splice(this.collisions.indexOf(obstacle), 1);
        }
    }
    draw(scene) {
        this.move();
        scene.drawImage(this.sprite, this.x - 100, this.y - 100, 200, 200);
    }
}

class Obstacle {
    constructor(x, y, width, height) {
        this.north = y - height / 2;
        this.south = y + height / 2;
        this.west = x - width / 2;
        this.east = x + width / 2;
        this.draw = this.draw.bind(this);
    }
    draw(scene) {
        scene.fillStyle = "green";
        scene.fillRect(this.west, this.north, this.width, this.height);
    }
}

class Stats {
    constructor() {
        this.draw = this.draw.bind(this);
    }
    static draw(scene) {
        scene.fillStyle = "black";
        scene.font = "bold 60px Papyrus";
        scene.fillText("Stats:", 20, 60);
        scene.font = "50px Papyrus";
        scene.fillText(`Up: ${player.keys["ArrowUp"]}`, 20, 120);
        scene.fillText(`Down: ${player.keys["ArrowDown"]}`, 20, 180);
        scene.fillText(`Left: ${player.keys["ArrowLeft"]}`, 20, 240);
        scene.fillText(`Right: ${player.keys["ArrowRight"]}`, 20, 300);
        scene.fillText(`Collisions: ${player.collisions.length}`, 20, 360);
    }
}

const player = new Player(1000, 600);
const borderLeft = new Obstacle(50, 300, 10, 600);
const obstacles = [borderLeft];

function drawBackground() {
    scene.fillStyle = "teal";
    scene.fillRect(0, 0, 2000, 1200);
}

function drawObjects() {
    player.draw(scene);
    borderLeft.draw(scene);
    Stats.draw(scene);
}

function drawScene() {
    scene.clearRect(0, 0, 2000, 1200);
    drawBackground();
    drawObjects();
}

setInterval(drawScene, 10);
window.addEventListener('keydown', player.updateKey);
window.addEventListener("keyup", player.releaseKey);
