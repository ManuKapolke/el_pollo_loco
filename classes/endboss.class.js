class Endboss extends MovableObject {
    y = 135;
    width = 1045 / 4;
    height = 1217 / 4;
    speed = 1;
    IMAGES_WALK = [
        'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];
    IMAGES_ALERT = [
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
    IMAGES_ATTACK = [
        'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G20.png'
    ];
    IMAGES_HURT = [
        'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];
    IMAGES_DEATH = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png'
    ];
    numberOfImagesToLoad = this.IMAGES_WALK.length + this.IMAGES_ALERT.length + this.IMAGES_ATTACK.length + this.IMAGES_HURT.length + this.IMAGES_DEATH.length + 1;
    offset = {
        top: 0.2 * this.height,
        right: 0.1 * this.width,
        bottom: 0.1 * this.height,
        left: 0.05 * this.width
    };
    energyLossPerHit = 10;
    animationCount = 0;
    // walking_sound = new Audio('assets/audio/endboss_walk.mp3');
    // alert_sound = new Audio('assets/audio/endboss_alert.mp3');
    // attack_sound = new Audio('assets/audio/endboss_attack.mp3');
    // hurt_sound = new Audio('assets/audio/endboss_hurt.mp3');
    // death_sound = new Audio('assets/audio/endboss_dead.mp3');
    walking_sound = audioElements['assets/audio/endboss_walk.mp3'];
    alert_sound = audioElements['assets/audio/endboss_alert.mp3'];
    attack_sound = audioElements['assets/audio/endboss_attack.mp3'];
    hurt_sound = audioElements['assets/audio/endboss_hurt.mp3'];
    death_sound = audioElements['assets/audio/endboss_dead.mp3'];
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
        setStoppableInterval(() => this.moveEndboss(), 1000 / 60);
        setStoppableInterval(() => this.playEndbossAnimations(), 200);
    }

    moveEndboss() {
        if (this.isWalking()) {
            if (this.characterIsRight()) {
                setTimeout(() => {
                    if (this.characterIsRight()) {
                        this.moveRight();
                    }
                }, 500);
            }
            if (this.characterIsLeft()) {
                setTimeout(() => {
                    if (this.characterIsLeft()) {
                        this.moveLeft();
                    }
                }, 500);
            }
        }

        if (this.shallJump()) {
            this.jump();
        }

        if (this.isAboveGround()) {
            let sgn = this.otherDirection ? 1 : -1;
            this.x = this.x + sgn * 3 * this.speed;
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

    shallJump() {
        return this.isAttacking() && !this.isAboveGround();
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
        let alertAfterHit = (this.timePassedSinceLastHit() > 500 && this.timePassedSinceLastHit() <= 800);
        let alertAfterAttack = (this.timePassedSinceLastHit() > 1600 && this.timePassedSinceLastHit() <= 2800);
        return alertAtFirstContact || alertAfterHit || alertAfterAttack;
    }

    isAttacking() {
        return this.timePassedSinceLastHit() > 800 &&
            this.timePassedSinceLastHit() <= 1600;
    }

    isWalking() {
        return this.world.character.hasBeenInFinalZone && !(this.isAlert() || this.isAttacking() || this.isHurt() || this.isDead());
    }

    playSoundEffects() {
        setStoppableInterval(() => {
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
        if (this.isWalking() && !this.world.character.isDead()) {
            this.world.playSoundIfSwitchedOn(this.walking_sound);
        }
        else {
            this.walking_sound.pause();
        }
    }

    playSoundIfEndbossIsAlert() {
        if (this.isAlert()) {
            if (this.alertSoundHasBeenPlayed) return;
            setTimeout(() => {
                this.world.playSoundIfSwitchedOn(this.alert_sound);
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
            this.world.playSoundIfSwitchedOn(this.attack_sound);
            this.attackSoundHasBeenPlayed = true;
        }
        else {
            this.attackSoundHasBeenPlayed = false;
        }
    }

    playSoundIfEndbossIsHurt() {
        if (this.isHurt()) {
            if (this.hurtSoundHasBeenPlayed) return;
            this.world.playSoundIfSwitchedOn(this.hurt_sound);
            this.hurtSoundHasBeenPlayed = true;
        }
        else {
            this.hurtSoundHasBeenPlayed = false;
        }
    }

    playSoundIfEndbossIsDead() {
        if (this.isDead()) {
            if (this.deathSoundHasBeenPlayed) return;
            this.world.playSoundIfSwitchedOn(this.death_sound);
            this.deathSoundHasBeenPlayed = true;
        }
    }
}