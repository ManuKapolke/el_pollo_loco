class Character extends MovableObject {
    x = 100;
    y = 140;
    width = 610 / 4;
    height = 1200 / 4;
    speed = 10;
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];
    offset = {
        top: 0.5 * this.height,
        right: 0.3 * this.width,
        bottom: 0.1 * this.height,
        left: 0.2 * this.width
    };
    coins = 0;
    bottles = 5;
    world;
    walking_sound = new Audio('audio/running.mp3');
    jump_sound = new Audio('audio/jump.mp3');

    nothingToThrow_sound = new Audio('audio/jump.mp3');


    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.applyGravity();

        this.animate();
        this.playSoundEffects();
    }

    animate() {
        setInterval(() => this.moveCharacter(), 1000 / 60);
        setInterval(() => this.playCharacterAnimations(), 50);
    }

    collect(obj) {
        let objIndex = this.world.level.collectableObjects.indexOf(obj);
        obj.collect_sound.play();

        this.bottles++;
        // this.coins++;

        this.world.level.collectableObjects.splice(objIndex, 1);
    }

    moveCharacter() {
        if (this.shallMoveRight()) {
            this.moveRight();
        }
        if (this.shallMoveLeft()) {
            this.moveLeft();
        }
        this.world.camera_x = -this.x + 100;

        if (this.shallJump()) {
            this.jump();
        }
    }

    shallMoveRight() {
        return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
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

    playCharacterAnimations() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        }
        else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        }
        else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
        }
        else {
            if (this.isWalking()) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }
    }

    playSoundEffects() {
        setInterval(() => {
            this.playSoundIfCharacterIsWalking();
            this.playSoundIfCharacterIsJumping();
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
}