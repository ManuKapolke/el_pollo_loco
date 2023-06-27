class Character extends MovableObject {
    x = 100;
    y = 135;
    width = 610 / 4;
    height = 1200 / 4;
    speed = 10;
    IMAGES_IDLE = [
        'assets/img/2_character_pepe/1_idle/idle/I-1.png',
        'assets/img/2_character_pepe/1_idle/idle/I-2.png',
        'assets/img/2_character_pepe/1_idle/idle/I-3.png',
        'assets/img/2_character_pepe/1_idle/idle/I-4.png',
        'assets/img/2_character_pepe/1_idle/idle/I-5.png',
        'assets/img/2_character_pepe/1_idle/idle/I-6.png',
        'assets/img/2_character_pepe/1_idle/idle/I-7.png',
        'assets/img/2_character_pepe/1_idle/idle/I-8.png',
        'assets/img/2_character_pepe/1_idle/idle/I-9.png',
        'assets/img/2_character_pepe/1_idle/idle/I-10.png',
    ];
    IMAGES_LONGIDLE = [
        'assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];
    IMAGES_WALK = [
        'assets/img/2_character_pepe/2_walk/W-21.png',
        'assets/img/2_character_pepe/2_walk/W-22.png',
        'assets/img/2_character_pepe/2_walk/W-23.png',
        'assets/img/2_character_pepe/2_walk/W-24.png',
        'assets/img/2_character_pepe/2_walk/W-25.png',
        'assets/img/2_character_pepe/2_walk/W-26.png'
    ];
    IMAGES_JUMP = [
        'assets/img/2_character_pepe/3_jump/J-31.png',
        'assets/img/2_character_pepe/3_jump/J-32.png',
        'assets/img/2_character_pepe/3_jump/J-33.png',
        'assets/img/2_character_pepe/3_jump/J-34.png',
        'assets/img/2_character_pepe/3_jump/J-35.png',
        'assets/img/2_character_pepe/3_jump/J-36.png',
        'assets/img/2_character_pepe/3_jump/J-37.png',
        'assets/img/2_character_pepe/3_jump/J-38.png',
        'assets/img/2_character_pepe/3_jump/J-39.png'
    ];
    IMAGES_HURT = [
        'assets/img/2_character_pepe/4_hurt/H-41.png',
        'assets/img/2_character_pepe/4_hurt/H-42.png',
        'assets/img/2_character_pepe/4_hurt/H-43.png'
    ];
    IMAGES_DEATH = [
        'assets/img/2_character_pepe/5_dead/D-51.png',
        'assets/img/2_character_pepe/5_dead/D-52.png',
        'assets/img/2_character_pepe/5_dead/D-53.png',
        'assets/img/2_character_pepe/5_dead/D-54.png',
        'assets/img/2_character_pepe/5_dead/D-55.png',
        'assets/img/2_character_pepe/5_dead/D-56.png'//, 'assets/img/2_character_pepe/5_dead/D-57.png'
    ];
    offset = {
        top: 0.5 * this.height,
        right: 0.3 * this.width,
        bottom: 0.05 * this.height,
        left: 0.2 * this.width
    };
    numberOfCoins = 0;
    numberOfBottles = 0;
    lastThrow = 0;
    walking_sound = new Audio('assets/audio/running.mp3');
    jump_sound = new Audio('assets/audio/jump_voice.mp3');
    nothingToThrow_sound = new Audio('assets/audio/jump.mp3');
    hurt_sound = new Audio('assets/audio/hurt.mp3');
    death_sound = new Audio('assets/audio/dead.mp3');
    sleeping_sound = new Audio('assets/audio/sleep.mp3');


    constructor() {
        super().loadImage(this.IMAGES_IDLE[0]);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONGIDLE);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEATH);
        this.applyGravity();

        this.animate();
        this.playSoundEffects();
    }

    animate() {
        setInterval(() => this.moveCharacter(), 1000 / 60);
        setInterval(() => this.playCharacterAnimations(), 100);
    }

    collect(obj) {
        if (obj instanceof CollectableBottle) {
            let objIndex = this.world.level.bottles.indexOf(obj);
            obj.collect_sound.play();
            this.numberOfBottles++;
            this.world.level.bottles.splice(objIndex, 1);
        }
        else if (obj instanceof CollectableCoin) {
            let objIndex = this.world.level.coins.indexOf(obj);
            obj.collect_sound.play();
            this.numberOfCoins++;
            this.energy = Math.min(this.energy + 5, 100);
            this.world.level.coins.splice(objIndex, 1);
        }
    }

    throwBottle(bottle) {
        bottle.throw(this.otherDirection);
        this.numberOfBottles--;
        this.lastThrow = new Date().getTime();
    }

    isJumpingOn(obj) {
        // return this.x + this.width - this.offset.right > obj.x + obj.offset.left &&
        //     this.x + this.offset.left < obj.x + obj.width - obj.offset.right &&
        //     this.y + this.height - this.offset.bottom <= obj.y + obj.offset.top && this.y + this.height > obj.y - 20 &&
        //     this.y + this.offset.top < obj.y + obj.height - obj.offset.bottom;
        return this.isColliding(obj) && this.isAboveGround();
    }

    killByJump(enemy) {
        if (enemy.isDead()) return;
        enemy.die();
        enemy.smash_sound.play();
        setTimeout(() => {
            this.world.deleteDeadEnemy(enemy);
        }, 500);

        this.jump();
    }

    killByThrow(bottle, enemy) {
        if (enemy.isDead()) return;
        enemy.die();
        this.world.deleteThrownBottle(bottle);
        this.world.deleteDeadEnemy(enemy);
    }

    moveCharacter() {
        if (this.shallMoveRight()) {
            this.moveRight();
        }
        if (this.shallMoveLeft()) {
            this.moveLeft();
        }
        if (this.x - 100 < MOST_RIGHT_BG * CANVAS_WIDTH) {
            this.world.camera_x = -this.x + 100;
        }

        if (this.shallJump()) {
            this.jump();
        }
    }

    shallMoveRight() {
        return this.world.keyboard.RIGHT && this.x + this.width < this.world.level.level_end_x - 50;
    }

    shallMoveLeft() {
        return this.world.keyboard.LEFT && this.x > this.world.level.level_start_x + 111;
    }

    shallJump() {
        return (this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isAboveGround();
    }

    moveRight() {
        super.moveRight();
        this.otherDirection = false;
    }

    moveLeft() {
        super.moveLeft();
        this.otherDirection = true;
    }

    isWalking() {
        return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
    }

    isSleeping() {
        return this.world.timePassedSinceLastKeyPress() > 10000 && this.timePassedSinceLastHit() > 5000;
    }

    playCharacterAnimations() {
        if (this.isDead()) {
            if (!this.lastImageIsShown(this.IMAGES_DEATH)) {
                this.playAnimation(this.IMAGES_DEATH);
            }
        }
        else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        }
        else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMP);
        }
        else if (this.isWalking()) {
            this.playAnimation(this.IMAGES_WALK);
        }
        else {
            if (!this.isSleeping()) {
                this.playAnimation(this.IMAGES_IDLE);
            } else {
                this.playAnimation(this.IMAGES_LONGIDLE);
            }
        }
    }

    playSoundEffects() {
        setInterval(() => {
            if (this.isDead()) {
                this.playSoundIfCharacterIsDead();
                return;
            }
            this.playSoundIfCharacterIsWalking();
            this.playSoundIfCharacterIsJumping();
            this.playSoundIfCharacterIsHurt();
            this.playSoundIfCharacterIsSleeping();
        }, 1000 / 60);
    }

    playSoundIfCharacterIsWalking() {
        if (this.isWalking()) {
            this.walking_sound.play();
        }
        else {
            this.walking_sound.pause();
        }
    }

    playSoundIfCharacterIsJumping() {
        if (this.shallJump()) {
            this.jump_sound.play();
        }
    }

    playSoundIfCharacterIsHurt() {
        if (this.isHurt()) {
            if (this.hurtSoundHasBeenPlayed) return;
            this.hurt_sound.play();
            this.hurtSoundHasBeenPlayed = true;
        }
        else {
            this.hurtSoundHasBeenPlayed = false;
        }
    }

    playSoundIfCharacterIsDead() {
        if (this.isDead()) {
            if (this.deathSoundHasBeenPlayed) return;
            this.death_sound.play();
            this.deathSoundHasBeenPlayed = true;
        }
    }

    playSoundIfCharacterIsSleeping() {
        if (this.isSleeping()) {
            this.sleeping_sound.play();
        }
        else {
            this.sleeping_sound.pause();
        }
    }

    timePassedSinceLastThrow() {
        return new Date().getTime() - this.lastThrow; // Difference in milliseconds
    }
}