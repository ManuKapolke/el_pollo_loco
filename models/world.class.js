class World {
    character = new Character();
    statusBarHealth = new StatusBarHealth();
    statusBarCoins = new StatusBarCoins();
    statusBarBottles = new StatusBarBottles();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d'); // definiert Funktionen/Einstellungen für das Einfügen von Bildern
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrows();
        }, 200);
    }

    checkCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
            }
        });

        this.level.collectableObjects.forEach(obj => {
            if (this.character.isColliding(obj)) {
                this.character.collect(obj);
            }
        });

        this.updateStatusBars();
    }

    updateStatusBars() {
        this.statusBarHealth.setPercentage(this.character.energy);
    }

    checkThrows() {
        if (this.keyboard.D) {
            if (this.character.bottles === 0) {
                this.character.nothingToThrow_sound.play();
                // todo: statusBarBottles blink?
                return;
            }
            let bottle = new ThrowableObject(this.character.x + 0.6 * this.character.width, this.character.y + 0.4 * this.character.height);
            this.level.throwableObjects.push(bottle);
            bottle.throw(this.character.otherDirection);
            this.character.bottles--;
        }
    }

    setWorld() {
        this.character.world = this; // damit im character auf keyboard zugegeriffen werden kann
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.throwableObjects);
        this.addObjectsToMap(this.level.collectableObjects);

        // Add fixed objects:
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);

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
        if (object.otherDirection) {
            this.flipImage(object);
        }

        object.draw(this.ctx);
        object.drawFrame(this.ctx);

        if (object.otherDirection) {
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
}