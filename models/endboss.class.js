class Endboss extends MovableObject {
    y = 140;
    width = 1045 / 4;
    height = 1217 / 4;
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
    offset = {
        top: 0.2 * this.height,
        right: 0.1 * this.width,
        bottom: 0.1 * this.height,
        left: 0.05 * this.width
    };

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);

        this.x = (MOST_RIGHT_BG - 1) * (CANVAS_WIDTH - 1);
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_ALERT);
        }, 200);
    }
}