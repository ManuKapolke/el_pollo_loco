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
    gameOver_sound = new Audio('assets/audio/game-over.mp3');
    gameWon_sound = new Audio('assets/audio/win.mp3');
    gameWon_music = new Audio('assets/audio/music/won.mp3');
    gameLost_music = new Audio('assets/audio/music/lost.mp3');
    background_music = new Audio('assets/audio/music/game-bg.mp3');
    endbossAppears_music = new Audio('assets/audio/music/endboss-appears2.mp3');
    gameOverSoundHasBeenPlayed = false;
    allImagesAreLoaded = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d'); // definiert Funktionen/Einstellungen für das Einfügen von Bildern
        this.ctx.font = '20px "boogaloo", Arial, Helvetica, sans-serif';
        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'center';
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.runGame();
        this.playBackgroundMusic();
    }

    checkIfAllImagesAreLoaded() {
        if (this.allImagesAreLoaded) return;

        if (
            this.character.allImagesAreLoaded() &&
            this.statusBarHealth.allImagesAreLoaded() &&
            this.statusBarCoins.allImagesAreLoaded() &&
            this.statusBarBottles.allImagesAreLoaded() &&
            // this.statusBarEndboss.allImagesAreLoaded() &&
            // // this.level.enemies.every(obj => obj.allImagesAreLoaded()) &&
            // this.level.bottles.every(obj => obj.allImagesAreLoaded()) &&
            // this.level.coins.every(obj => obj.allImagesAreLoaded()) &&
            this.level.clouds.every(obj => obj.allImagesAreLoaded()) &&
            this.level.backgroundObjects.every(obj => obj.allImagesAreLoaded())
        ) {
            this.allImagesAreLoaded = true;
        }
    }

    playBackgroundMusic() {
        setStoppableInterval(() => {
            this.playMusicIfSwitchedOn(this.background_music);
            // this.background_music.addEventListener('ended', () => {
            //     this.background_music.play();
            // }, false);

            if (this.character.hasBeenInFinalZone) {
                this.background_music.pause();
                this.playMusicIfSwitchedOn(this.endbossAppears_music);
            }
        }, 100);
    }

    runGame() {
        setStoppableInterval(() => {
            this.checkCollisions();
            this.checkThrows();
            this.checkChickenKills();
            this.checkEnteringFinalZone();
            this.checkEndbossHits();
        }, 50);
        setInterval(() => {
            this.checkGameOver();
        }, 300);
    }

    checkEnteringFinalZone() {
        if (this.character.hasBeenInFinalZone) return;

        if (this.character.isInFinalZone()) {
            this.character.hasBeenInFinalZone = true;
            // showElement('endboss-status');
        }
        // else {
        //     removeElement('endboss-status');
        // }
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
                this.playSoundIfSwitchedOn(this.character.nothingToThrow_sound);
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
                this.level.endboss.hit();
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
            this.level.enemies.splice(enemyIndex, 1);
        }, 500);
    }

    deleteAllEnemies() {
        this.level.enemies = [];
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
                this.gameLost();
            }, 800);
        }
        else if (this.level.endboss.isDead()) {
            if (!this.level.endboss.hasDied) {
                this.level.endboss.hasDied = true;
                this.level.endboss.speedY = 0;
            }
            setTimeout(() => {
                if (gameIsLost) return;
                this.gameWon();
            }, 1000);
        }
    }

    gameLost() {
        this.background_music.pause();
        this.endbossAppears_music.pause();
        if (!this.gameOverSoundHasBeenPlayed) {
            this.playSoundIfSwitchedOn(this.gameOver_sound);
            this.gameOverSoundHasBeenPlayed = true;
        }
        clearStoppableIntervals();
        setTimeout(() => {
            if (gameIsRunning) {
                gameIsRunning = false;
                gameIsLost = true;
                showEndScreen('end-screen-lost');
            }
            this.playMusicIfSwitchedOn(this.gameLost_music);
        }, 2000);
    }

    gameWon() {
        this.endbossAppears_music.pause();
        clearStoppableIntervals();
        setTimeout(() => {
            if (gameIsRunning) {
                gameIsRunning = false;
                gameIsWon = true;
                showEndScreen('end-screen-won');
                this.deleteAllEnemies();
            }
            this.playMusicIfSwitchedOn(this.gameWon_music);

        }, 1000);
        setTimeout(() => {
            this.character.speed = 25;
            this.character.moveTowardsCenter();
            this.character.playDanceAnimation();
        }, 2800);
    }

    updateStatusBars() {
        const coinsPercentage = (100 / this.level.numberOfCoins) * this.character.numberOfCoins;
        const bottlesPercentage = (100 / this.level.numberOfBottles) * this.character.numberOfBottles;

        this.statusBarHealth.setPercentage(this.character.energy);
        this.statusBarCoins.setPercentage(coinsPercentage);
        this.statusBarBottles.setPercentage(bottlesPercentage);
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
        this.ctx.fillText(this.character.energy, ...this.getStatusBarCoordinates(this.statusBarHealth));
        this.ctx.fillText(this.character.numberOfCoins, ...this.getStatusBarCoordinates(this.statusBarCoins));
        this.ctx.fillText(this.character.numberOfBottles, ...this.getStatusBarCoordinates(this.statusBarBottles));

        if (this.character.hasBeenInFinalZone) {
            this.addToMap(this.statusBarEndboss);
            this.ctx.textAlign = 'right';
            this.ctx.fillText(this.level.endboss.energy, ...this.getStatusBarCoordinates(this.statusBarEndboss));
            this.ctx.textAlign = 'center';
        }


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

    getStatusBarCoordinates(statusBar) {
        let x = statusBar.x + statusBar.width + 18;
        let y = statusBar.y + 0.8 * statusBar.height;

        if (statusBar === this.statusBarEndboss) {
            x = statusBar.x - 5;
            y = statusBar.y + 0.6 * statusBar.height;
        }
        return [x, y];
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

    playSoundIfSwitchedOn(soundObject) {
        if (soundIsOn) {
            soundObject.play();
        } else {
            soundObject.pause();
        }
    }

    playMusicIfSwitchedOn(musicObject) {
        if (musicIsOn) {
            musicObject.play();
        } else {
            musicObject.pause();
        }
    }
}