class MovableObject extends DrawableObject {
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    world;
    gravityInterval;
    deathSoundHasBeenPlayed = false;
    hurtSoundHasBeenPlayed = false;
    hasBeenInFinalZone = false;
    hasDied = false;

    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0 || this.isDead()) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
            else {
                this.y = 135;
            }
        }, 1000 / 25);
    }

    stopGravity() {
        clearInterval(this.gravityInterval);
    }

    isColliding(obj) {
        return this.isOverlapping(obj);
    }

    isAboveGround() {
        if (this instanceof ThrownObject) {
            return true;
        }
        else {
            return this.y < 135;
        }
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    jump() {
        this.speedY = 30;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    hit(energyLossFactor = 1) {
        if (this.isHurt()) return;
        this.energy = Math.max(this.energy - energyLossFactor * 5, 0);
        this.lastHit = new Date().getTime();
    }

    die() {
        this.energy = 0;
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
        return this.x > MOST_RIGHT_BG * CANVAS_WIDTH;
    }
}