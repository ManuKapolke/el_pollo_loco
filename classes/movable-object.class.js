class MovableObject extends DrawableObject {
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    energyLossPerHit;
    world;
    gravityInterval;
    deathSoundHasBeenPlayed = false;
    hurtSoundHasBeenPlayed = false;
    hasBeenInFinalZone = false;
    hasDied = false;

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0 || this.isDead()) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
            else {
                this.y = GROUND_Y;
            }
        }, 1000 / 25);
    }

    stopGravity() {
        clearInterval(this.gravityInterval);
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    moveTowardsCenter() {
        if (this.isInLeftHalfOfCanvas()) {
            this.moveRight();
        }
        else if (this.isInRightHalfOfCanvas()) {
            this.moveLeft();
        }
    }

    jump() {
        this.speedY = 30;
    }

    hit(energyLossFactor = 1) {
        if (this.isHurt()) return;
        this.energy = Math.max(this.energy - energyLossFactor * this.energyLossPerHit, 0);
        this.lastHit = new Date().getTime();
    }

    isAboveGround() {
        if (this instanceof ThrownObject) {
            return true;
        }
        else {
            return this.y < GROUND_Y;
        }
    }

    isColliding(obj) {
        return this.isOverlapping(obj);
    }

    isHurt() {
        return this.timePassedSinceLastHit() <= 500;
    }

    isDead() {
        return this.energy === 0;
    }

    timePassedSinceLastHit() {
        return new Date().getTime() - this.lastHit; // Difference in milliseconds
    }

    lastImageIsShown(images) {
        return this.img.src.endsWith(images.at(-1));
    }

    isInFinalZone() {
        return this.x > MOST_RIGHT_BG * CANVAS_WIDTH - 140;
    }
}