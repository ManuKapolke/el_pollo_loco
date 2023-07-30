class Chicken extends MovableObject {
    y = 350;
    width = 248 / 3;
    height = 243 / 3;
    IMAGES_WALK = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    IMAGES_DEATH = [
        'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];
    numberOfImagesToLoad = this.IMAGES_WALK.length + this.IMAGES_DEATH.length + 1;
    offset = {
        top: 0.05 * this.height,
        right: 0.02 * this.width,
        bottom: 0.2 * this.height,
        left: 0.02 * this.width
    };
    energyLossPerHit = 100;
    smash_sound = audioElements['assets/audio/smash.mp3'];
    death_sound = audioElements['assets/audio/chicken_dead.mp3'];

    constructor() {
        super().loadImage(this.IMAGES_WALK[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_DEATH);

        this.x = 2 * CANVAS_WIDTH + Math.random() * (MOST_RIGHT_BG - 2) * CANVAS_WIDTH;
        this.speed = 0.15 + Math.random() * 0.5;

        this.animate();
        this.playSoundEffects();
    }

    animate() {
        setStoppableInterval(() => this.moveChicken(), 1000 / 60);
        setStoppableInterval(() => this.playChickenAnimations(), 200);
    }

    moveChicken() {
        if (this.isDead()) return;
        this.moveLeft();
    }

    playChickenAnimations() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEATH);
        }
        else {
            this.playAnimation(this.IMAGES_WALK);
        }
    }

    playSoundEffects() {
        setStoppableInterval(() => {
            if (this.isDead()) {
                if (this.deathSoundHasBeenPlayed) return;
                this.death_sound.currentTime = 0;
                this.world.playSoundIfSwitchedOn(this.death_sound);
                this.deathSoundHasBeenPlayed = true;
            }
        }, 200);
    }
}