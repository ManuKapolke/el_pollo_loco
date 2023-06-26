class Endboss extends MovableObject {
    y = 140;
    width = 1045 / 4;
    height = 1217 / 4;
    speed = 1;
    IMAGES_WALK = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];
    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];
    IMAGES_DEATH = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];
    offset = {
        top: 0.2 * this.height,
        right: 0.1 * this.width,
        bottom: 0.1 * this.height,
        left: 0.05 * this.width
    };
    animationCount = 0;
    walking_sound = new Audio('audio/chicken2.mp3');
    alert_sound = new Audio('audio/endboss_alert.mp3');
    attack_sound = new Audio('audio/endboss_alert.mp3');
    hurt_sound = new Audio('audio/endboss_hurt.mp3');
    death_sound = new Audio('audio/endboss_dead.mp3');
    alertSoundHasBeenPlayed = false;
    attackSoundHasBeenPlayed = false;


    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEATH);

        this.x = WORLD_END - this.width;
        this.applyGravity();
        this.animate();
        this.playSoundEffects();
    }

    animate() {
        setInterval(() => this.moveEndboss(), 1000 / 60);
        setInterval(() => this.playEndbossAnimations(), 200);
    }

    moveEndboss() {
        if (!this.isWalking()) return;

        if (this.characterIsRight()) {
            setTimeout(() => {
                if (this.characterIsRight()) {
                    this.moveRight();
                }
            }, 1000);
        }
        if (this.characterIsLeft()) {
            setTimeout(() => {
                if (this.characterIsLeft()) {
                    this.moveLeft();
                }
            }, 1000);
        }

        if (this.shallJump()) {
            this.jump();
        }
    }

    characterIsRight() {
        return this.x + 0.5 * this.width < this.world.character.x + 0.5 * this.world.character.width;
    }

    characterIsLeft() {
        return !this.characterIsRight();
    }

    moveRight() {
        super.moveRight();
        this.otherDirection = true;
    }

    moveLeft() {
        super.moveLeft();
        this.otherDirection = false;
    }

    jump() {// todo
        let sgn = this.otherDirection ? 1 : -1;
        this.speedY = 30;
        this.x = this.x + sgn * 50 * this.speed;
    }

    shallJump() {
        return this.img.src.endsWith(this.IMAGES_ATTACK[4]);
    }

    playEndbossAnimations() {
        if (!this.world.character.hasBeenInFinalZone) {
            this.animationCount = 0;
            return;
        }
        // if (this.animationCount < 5) {
        //     this.animationCount++;
        //     return;
        // }

        if (this.isDead()) {
            if (!this.lastImageIsShown(this.IMAGES_DEATH)) {
                this.playAnimation(this.IMAGES_DEATH);
            }
        }
        else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        }
        else if (this.isAlert()) {
            this.playAnimation(this.IMAGES_ALERT);
        }
        else if (this.isAttacking()) {
            this.playAnimation(this.IMAGES_ATTACK);
        }
        else {
            this.playAnimation(this.IMAGES_WALK);
        }

        this.animationCount++;
    }

    isAlert() {
        let alertAtFirstContact = (this.animationCount < 8);
        let alertAfterHit = (this.timePassedSinceLastHit() > 500 && this.timePassedSinceLastHit() <= 3000);
        return alertAtFirstContact || alertAfterHit;
    }

    isAttacking() {
        return this.timePassedSinceLastHit() > 3000 &&
            this.timePassedSinceLastHit() <= 5400;
    }

    isWalking() {
        return this.world.character.hasBeenInFinalZone && !(this.isAlert() || this.isAttacking() || this.isHurt() || this.isDead());
    }

    playSoundEffects() {
        setInterval(() => {
            if (!this.world.character.hasBeenInFinalZone) return;
            if (this.isDead()) {
                this.playSoundIfEndbossIsDead();
                return;
            }
            this.playSoundIfEndbossIsWalking();
            this.playSoundIfEndbossIsAlert();
            this.playSoundIfEndbossIsAttacking();
            this.playSoundIfEndbossIsHurt();

        }, 1000 / 60);
    }

    playSoundIfEndbossIsWalking() {
        if (this.isWalking()) {
            this.walking_sound.play();
        }
        else {
            this.walking_sound.pause();
        }
    }

    playSoundIfEndbossIsAlert() {
        if (this.isAlert()) {
            if (this.alertSoundHasBeenPlayed) return;
            setTimeout(() => {
                this.alert_sound.play();
            }, 1000);
            this.alertSoundHasBeenPlayed = true;
        }
        else {
            this.alertSoundHasBeenPlayed = false;
        }
    }

    playSoundIfEndbossIsAttacking() {
        if (this.isAttacking()) {
            if (this.attackSoundHasBeenPlayed) return;
            this.attack_sound.play();
            this.attackSoundHasBeenPlayed = true;
        }
        else {
            this.attackSoundHasBeenPlayed = false;
        }
    }

    playSoundIfEndbossIsHurt() {
        if (this.isHurt()) {
            if (this.hurtSoundHasBeenPlayed) return;
            this.hurt_sound.play();
            this.hurtSoundHasBeenPlayed = true;
        }
        else {
            this.hurtSoundHasBeenPlayed = false;
        }
    }

    playSoundIfEndbossIsDead() {
        if (this.isDead()) {
            if (this.deathSoundHasBeenPlayed) return;
            this.death_sound.play();
            this.deathSoundHasBeenPlayed = true;
        }
    }
}