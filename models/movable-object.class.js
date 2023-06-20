class MovableObject extends DrawableObject {
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    // onCollisionCourse;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrownObject) {
            return true;
        }
        else {
            return this.y < 120;
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

    isColliding(obj) {
        return this.x + this.width - this.offset.right > obj.x + obj.offset.left &&
            this.x + this.offset.left < obj.x + obj.width - obj.offset.right &&
            this.y + this.height - this.offset.bottom > obj.y + obj.offset.top &&
            this.y + this.offset.top < obj.y + obj.height - obj.offset.bottom;
    }

    hit() {
        if (this.isHurt()) return;
        this.energy = Math.max(this.energy - 5, 0);
        this.lastHit = new Date().getTime();
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
}