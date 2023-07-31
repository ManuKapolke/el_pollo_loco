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
    gameOver_sound = audioElements['assets/audio/game-over.mp3'];
    gameWon_music = audioElements['assets/audio/music/won.mp3'];
    gameLost_music = audioElements['assets/audio/music/lost.mp3'];
    background_music = audioElements['assets/audio/music/game-bg.mp3'];
    endbossAppears_music = audioElements['assets/audio/music/endboss-appears.mp3'];
    gameOverSoundHasBeenPlayed = false;
    startImagesAreLoaded = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d'); // defines functions/settings for insertion of images
        this.ctx.font = '20px "boogaloo", Arial, Helvetica, sans-serif';
        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'center';
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.playBackgroundMusic();
        this.runGame();
    }

    /*--------------------------------------------------
    Prepare and Run Game
    ---------------------------------------------------*/
    checkIfStartImagesAreLoaded() {
        if (this.startImagesAreLoaded) return;

        if (
            this.character.allImagesAreLoaded() &&
            this.statusBarHealth.allImagesAreLoaded() &&
            this.statusBarCoins.allImagesAreLoaded() &&
            this.statusBarBottles.allImagesAreLoaded() &&
            this.level.clouds.every(obj => obj.allImagesAreLoaded()) &&
            this.level.backgroundObjects.every(obj => obj.allImagesAreLoaded())
        ) {
            this.startImagesAreLoaded = true;
        }
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => {
            enemy.world = this;
        });
    }

    playBackgroundMusic() {
        setStoppableInterval(() => {
            this.playMusicIfSwitchedOn(this.background_music);

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

    timePassedSinceLastKeyPress() {
        return aKeyIsPressed() ? 0 : (new Date().getTime() - this.keyboard.lastKeyPress); // difference in milliseconds
    }

    /*--------------------------------------------------
    Collisions
    ---------------------------------------------------*/
    checkCollisions() {
        this.checkCollisionWithEnemies();
        this.checkCollisionWithCollectableObjects(this.level.bottles);
        this.checkCollisionWithCollectableObjects(this.level.coins);
        this.updateStatusBars();
    }

    checkCollisionWithEnemies() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy) && !this.character.isAboveGround()) {
                const energyLossFactor = enemy instanceof Endboss ? 3 : 1;
                this.character.hit(energyLossFactor);
            }
        });
    }

    checkCollisionWithCollectableObjects(collectableObjects) {
        collectableObjects.forEach(obj => {
            if (this.character.isColliding(obj)) {
                this.character.collect(obj);
            }
        });
    }

    updateStatusBars() {
        const coinsPercentage = (100 / this.level.numberOfCoins) * this.character.numberOfCoins;
        const bottlesPercentage = (100 / this.level.numberOfBottles) * this.character.numberOfBottles;

        this.statusBarHealth.setPercentage(this.character.energy);
        this.statusBarCoins.setPercentage(coinsPercentage);
        this.statusBarBottles.setPercentage(bottlesPercentage);
        this.statusBarEndboss.setPercentage(this.level.endboss.energy);
    }

    /*--------------------------------------------------
    Throws
    ---------------------------------------------------*/
    checkThrows() {
        if (!this.keyboard.D) return;
        if (this.character.timePassedSinceLastThrow() < 500) return;
        if (this.character.numberOfBottles === 0) {
            this.character.nothingToThrow_sound.currentTime = 0;
            this.playSoundIfSwitchedOn(this.character.nothingToThrow_sound);
            return;
        }

        this.createAndThrowObject();
    }

    createAndThrowObject() {
        const bottle_x = this.character.x + 0.6 * this.character.width;
        const bottle_y = this.character.y + 0.4 * this.character.height;
        const bottle = new ThrownObject(bottle_x, bottle_y, this);

        this.thrownObjects.push(bottle);
        this.character.throwBottle(bottle);
    }

    /*--------------------------------------------------
    Kills
    ---------------------------------------------------*/
    checkChickenKills() {
        this.level.enemies.forEach(chicken => {
            if (chicken instanceof Endboss) return;
            this.checkKillByJump(chicken);
            this.checkKillByThrow(chicken);
        });
    }

    checkKillByJump(chicken) {
        if (this.character.isJumpingOn(chicken)) {
            this.character.killByJump(chicken);
        }
    }

    checkKillByThrow(chicken) {
        this.thrownObjects.forEach(bottle => {
            if (bottle.isColliding(chicken)) {
                this.character.killByThrow(bottle, chicken);
            }
        });
    }

    deleteThrownBottle(bottle) {
        setTimeout(() => {
            let bottleIndex = this.thrownObjects.indexOf(bottle);
            this.thrownObjects.splice(bottleIndex, 1);
        }, 300);
    }

    deleteDeadEnemies() {
        this.level.enemies.forEach(enemy => {
            if (enemy.isDead()) deleteDeadEnemy(enemy);
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

    /*--------------------------------------------------
    Final Zone
    ---------------------------------------------------*/
    checkEnteringFinalZone() {
        if (this.character.hasBeenInFinalZone) return;
        if (this.character.isInFinalZone()) this.character.hasBeenInFinalZone = true;
    }

    /*--------------------------------------------------
    Endboss
    ---------------------------------------------------*/
    checkEndbossHits() {
        this.thrownObjects.forEach(bottle => {
            if (bottle.isColliding(this.level.endboss)) {
                this.level.endboss.hit();
                this.deleteThrownBottle(bottle);
                this.level.endboss.speed += 0.1;
            }
        });
        this.updateStatusBars();
    }

    /*--------------------------------------------------
    Game Over
    ---------------------------------------------------*/
    checkGameOver() {
        if (this.character.isDead()) {
            setTimeout(() => this.onLostGame(), 800);
        }
        else if (this.level.endboss.isDead()) {
            if (!this.level.endboss.hasDied) {
                this.level.endboss.hasDied = true;
                this.level.endboss.speedY = 0;
            }
            setTimeout(() => {
                if (this.character.isDead()) return;
                this.onWonGame();
            }, 1000);
        }
    }

    onLostGame() {
        this.stopBackgroundSounds();
        this.playGameOverSound();
        clearStoppableIntervals();
        setTimeout(() => this.endGameOnLoss(), 2000);
    }

    onWonGame() {
        this.stopBackgroundSounds();
        clearStoppableIntervals();
        setTimeout(() => this.endGameOnWin(), 1000);
        setTimeout(() => this.character.dance(), 2800);
    }

    stopBackgroundSounds() {
        this.background_music.pause();
        this.endbossAppears_music.pause();
        this.character.walking_sound.pause();
    }

    playGameOverSound() {
        if (!this.gameOverSoundHasBeenPlayed) {
            this.playSoundIfSwitchedOn(this.gameOver_sound);
            this.gameOverSoundHasBeenPlayed = true;
        }
    }

    endGameOnLoss() {
        if (gameIsRunning) {
            gameIsRunning = false;
            gameIsLost = true;
            this.setupEndScreen('end-screen-lost');
        }
        this.playMusicIfSwitchedOn(this.gameLost_music);
    }

    endGameOnWin() {
        if (gameIsRunning) {
            gameIsRunning = false;
            gameIsWon = true;
            this.setupEndScreen('end-screen-won');
            this.deleteAllEnemies();
        }
        this.playMusicIfSwitchedOn(this.gameWon_music);
    }

    setupEndScreen(screenId) {
        removeElement('touch-keys');
        showEndScreen(screenId);
        if (document.getElementById('info-screen').classList.contains('full-opacity')) {
            toggleEndScreen(screenId);
        }
    }

    /*--------------------------------------------------
    Draw
    ---------------------------------------------------*/
    adjustCameraPosition() {
        const desiredLeftEdge = this.character.x - 100;
        if (desiredLeftEdge < MOST_RIGHT_BG * CANVAS_WIDTH && desiredLeftEdge > WORLD_START)
            this.camera_x = -desiredLeftEdge;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0); // objects depend on camera
        this.drawBackground();
        this.drawCollectableObjects();
        this.drawThrownObjects();
        this.ctx.translate(-this.camera_x, 0); // to add fixed objects
        this.drawStatusBars();
        this.ctx.translate(this.camera_x, 0);
        this.drawCharacter();
        this.drawEnemies();
        this.ctx.translate(-this.camera_x, 0);
        this.callDrawFunctionRepeatedly();
    }

    drawBackground() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
    }

    drawCollectableObjects() {
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
    }

    drawThrownObjects() {
        this.addObjectsToMap(this.thrownObjects);
    }

    drawStatusBars() {
        this.drawStatusBarsOfCharacter();
        this.drawStatusBarOfEndboss();
    }

    drawStatusBarsOfCharacter() {
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        this.ctx.fillText(this.character.energy, ...this.getStatusBarCoordinates(this.statusBarHealth));
        this.ctx.fillText(this.character.numberOfCoins, ...this.getStatusBarCoordinates(this.statusBarCoins));
        this.ctx.fillText(this.character.numberOfBottles, ...this.getStatusBarCoordinates(this.statusBarBottles));
    }

    drawStatusBarOfEndboss() {
        if (this.character.hasBeenInFinalZone) {
            this.addToMap(this.statusBarEndboss);
            this.ctx.textAlign = 'right';
            this.ctx.fillText(this.level.endboss.energy, ...this.getStatusBarCoordinates(this.statusBarEndboss));
            this.ctx.textAlign = 'center';
        }
    }

    drawCharacter() {
        this.addToMap(this.character);
    }

    drawEnemies() {
        this.addObjectsToMap(this.level.enemies);
    }

    callDrawFunctionRepeatedly() {
        let self = this;
        requestAnimationFrame(() => self.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach(obj => this.addToMap(obj));
    }

    addToMap(object) {
        this.flipImageIfNecessary(object);

        try {
            object.draw(this.ctx);
            // object.drawFrames(this.ctx);
        } catch (error) {
            console.warn(error);
            console.log(object);
        }

        this.flipImageBackIfNecessary(object);
    }

    flipImageIfNecessary(object) {
        if (object instanceof MovableObject && object.otherDirection)
            this.flipImage(object);
    }

    flipImageBackIfNecessary(object) {
        if (object instanceof MovableObject && object.otherDirection)
            this.flipImageBack(object);
    }

    flipImage(object) {
        this.ctx.save(); // saves current ctx settings for later recovery
        this.ctx.translate(object.width, 0); // future inserted images will be shifted to the right by object.width (x-axis)
        this.ctx.scale(-1, 1); // future inserted images will be mirrored along x-axis
        object.x *= -1;
    }

    flipImageBack(object) {
        object.x *= -1;
        this.ctx.restore(); // recovers saved ctx settings
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

    /*--------------------------------------------------
    Soundsettings
    ---------------------------------------------------*/
    playSoundIfSwitchedOn(soundObject) {
        if (soundIsOn) {
            try {
                soundObject.play();
            } catch (error) {
                console.warn('Error playing sound', error);
                console.log('Unable to play sound', soundObject);
            }
        } else {
            soundObject.pause();
        }
    }

    playMusicIfSwitchedOn(musicObject) {
        if (musicIsOn) {
            try {
                musicObject.play();
            } catch (error) {
                console.warn('Error playing music', error);
                console.log('Unable to play music', musicObject);
            }
        } else {
            musicObject.pause();
        }
    }
}