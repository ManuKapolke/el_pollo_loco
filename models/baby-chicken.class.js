class BabyChicken extends Chicken {
    y = 360;
    width = 236 / 3;
    height = 210 / 3;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];
    IMAGES_DEATH = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];
    death_sound = new Audio('audio/smash.mp3');

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEATH);

        this.x = 200 + Math.random() * (WORLD_WIDTH - (200 - WORLD_START));
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

}