class Chicken extends MovableObject {
    y = 350;
    width = 248 / 3;
    height = 243 / 3;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    offset = {
        top: 0.05 * this.height,
        right: 0.02 * this.width,
        bottom: 0.2 * this.height,
        left: 0.02 * this.width
    };

    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);

        this.x = 200 + Math.random() * (WORLD_WIDTH - (200 - WORLD_START));
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }
}