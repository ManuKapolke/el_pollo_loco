class BabyChicken extends Chicken {
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
    death_sound = new Audio('assets/audio/baby-chicken_dead.mp3');

    constructor() {
        super().loadImage(this.IMAGES_WALK[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_DEATH);

        this.x = 200 + Math.random() * (WORLD_WIDTH - (200 - WORLD_START));
        this.speed = 0.25 + Math.random() * 0.6;
        this.animate();
    }

}