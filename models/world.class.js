class World {
    character = new Character();
    statusBarHealth = new StatusBarHealth();
    statusBarCoins = new StatusBarCoins();
    statusBarBottles = new StatusBarBottles();
    statusBarEndboss = new StatusBarEndboss();
    thrownObjects = [];
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    gameOver_sound = new Audio('audio/game-over.mp3');
    gameWon_sound = new Audio('audio/win.mp3');

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d'); // definiert Funktionen/Einstellungen für das Einfügen von Bildern
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.runGame();
    }

    runGame() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrows();
            this.checkChickenKills();
            this.checkEnteringFinalZone();
            this.checkEndbossHits();
            this.checkGameOver();
        }, 50);
    }

    checkEnteringFinalZone() {
        if (this.character.hasBeenInFinalZone) return;

        if (this.character.isInFinalZone()) {
            this.character.hasBeenInFinalZone = true;
        }
    }

    checkCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && !this.character.isAboveGround()) {
                const energyLossFactor = enemy instanceof Endboss ? 2 : 1;
                this.character.hit(energyLossFactor);
            }
        });

        this.level.bottles.forEach(bottle => {
            if (this.character.isColliding(bottle)) {
                this.character.collect(bottle);
            }
        });

        this.level.coins.forEach(coin => {
            if (this.character.isColliding(coin)) {
                this.character.collect(coin);
            }
        });

        this.updateStatusBars();
    }

    checkThrows() {
        if (this.keyboard.D) {
            if (this.character.numberOfBottles === 0) {
                this.character.nothingToThrow_sound.play();
                return;
            }
            if (this.character.timePassedSinceLastThrow() < 500) return;

            let bottle_x = this.character.x + 0.6 * this.character.width;
            let bottle_y = this.character.y + 0.4 * this.character.height;
            let bottle = new ThrownObject(bottle_x, bottle_y, this);

            this.thrownObjects.push(bottle);
            this.character.throwBottle(bottle);
        }
    }

    checkChickenKills() {
        this.level.enemies.forEach(chicken => {
            if (chicken instanceof Endboss) return;
            if (this.character.isJumpingOn(chicken)) {
                this.character.killByJump(chicken);
            }
            this.thrownObjects.forEach(bottle => {
                if (bottle.isColliding(chicken)) {
                    this.character.killByThrow(bottle, chicken);
                }
            });
        });
    }

    checkEndbossHits() {
        // let endboss = this.level.enemies.at(-1);
        this.thrownObjects.forEach(bottle => {
            if (bottle.isColliding(this.level.endboss)) {
                this.level.endboss.hit(4);
                this.deleteThrownBottle(bottle);
                this.level.endboss.speed += 0.1;
            }
        });

        this.updateStatusBars();
    }

    deleteDeadEnemies() {
        this.level.enemies.forEach(enemy => {
            if (enemy.isDead()) {
                deleteDeadEnemy(enemy);
            }
        });
    }

    deleteDeadEnemy(enemy) {
        setTimeout(() => {
            let enemyIndex = this.level.enemies.indexOf(enemy);
            // console.log("enemy killed: " + enemyIndex);
            this.level.enemies.splice(enemyIndex, 1);
        }, 500);
    }

    deleteThrownBottle(bottle) {
        setTimeout(() => {
            let bottleIndex = this.thrownObjects.indexOf(bottle);
            this.thrownObjects.splice(bottleIndex, 1);
        }, 300);
    }

    checkGameOver() {
        if (this.character.isDead()) {
            setTimeout(() => {
                this.gameOver();
            }, 1000);
        }
        else if (this.level.endboss.isDead()) {
            setTimeout(() => {
                this.gameWon();
            }, 1000);
        }
    }

    gameOver() {
        this.gameOver_sound.play();
        clearAllIntervals();
    }

    gameWon() {
        this.gameWon_sound.play();
        clearAllIntervals();
    }

    updateStatusBars() {
        this.statusBarHealth.setPercentage(this.character.energy);
        this.statusBarBottles.setPercentage(10 * this.character.numberOfBottles);
        this.statusBarCoins.setPercentage(10 * this.character.numberOfCoins);
        this.statusBarEndboss.setPercentage(this.level.endboss.energy);
    }

    setWorld() {
        this.character.world = this; // damit im character auf keyboard zugegeriffen werden kann
        this.level.enemies.forEach((enemy) => {
            enemy.world = this;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.thrownObjects);

        // Add fixed objects:
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        this.addToMap(this.statusBarEndboss);

        // Add non-fixed objects:
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);

        this.ctx.translate(-this.camera_x, 0);

        // draw() wird immmer wieder aufgerufen:
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(object) {
        if (object instanceof MovableObject && object.otherDirection) {
            this.flipImage(object);
        }

        try {
            object.draw(this.ctx);
            // object.drawFrame(this.ctx);
        } catch (error) {
            console.warn(error);
            console.log(object);
        }


        if (object instanceof MovableObject && object.otherDirection) {
            this.flipImageBack(object);
        }
    }

    flipImage(object) {
        this.ctx.save(); // speichert aktuelle ctx-Einstellungen für spätere Wiederherstellung
        this.ctx.translate(object.width, 0); // zukünftig eingefügte Bilder werden um object.width nach rechts verschoben (x-Achse)
        this.ctx.scale(-1, 1); // zukünftig eingefügte Bilder werden an x-Achse gespiegelt
        object.x *= -1;
    }

    flipImageBack(object) {
        object.x *= -1;
        this.ctx.restore(); // stellt gespeicherte ctx-Einstellungen wieder her
    }

    timePassedSinceLastKeyPress() {
        return new Date().getTime() - this.keyboard.lastKeyPress; // Difference in milliseconds
    }

    getCurrentBackground() {
        let currentBackground;
        this.level.backgroundObjects.forEach((bg) => {
            if (bg.x <= this.character.x && this.character.x < bg.x + CANVAS_WIDTH) {
                currentBackground = Math.floor(this.level.backgroundObjects.indexOf(bg) / 4) + MOST_LEFT_BG;
                return;
            }
        });
        return currentBackground;
    }
}