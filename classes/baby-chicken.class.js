class BabyChicken extends MovableObject {
    y = 360;
    width = 236 / 3;
    height = 210 / 3;
    IMAGES_WALK = [
        'assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    IMAGES_DEATH = [
        'assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];
    numberOfImagesToLoad = this.IMAGES_WALK.length + this.IMAGES_DEATH.length + 1;
    offset = {
        top: 0.05 * this.height,
        right: 0.02 * this.width,
        bottom: 0.2 * this.height,
        left: 0.02 * this.width
    };
    energyLossPerHit = 100;
    smash_sound = new Audio('assets/audio/smash.mp3');
    death_sound = new Audio('assets/audio/baby-chicken_dead.mp3');

    constructor() {
        super().loadImage(this.IMAGES_WALK[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_DEATH);

        this.x = 2 * CANVAS_WIDTH + Math.random() * (MOST_RIGHT_BG - 2) * CANVAS_WIDTH;
        this.speed = 0.25 + Math.random() * 0.6;
        this.animate();
    }

    animate() {
        setStoppableInterval(() => {
            if (this.isDead()) return;
            this.moveLeft();
        }, 1000 / 60);

        setStoppableInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEATH);
                if (this.deathSoundHasBeenPlayed) return;
                this.world.playSoundIfSwitchedOn(this.death_sound);
                this.deathSoundHasBeenPlayed = true;
            }
            else {
                this.playAnimation(this.IMAGES_WALK);
            }
        }, 200);
    }
}