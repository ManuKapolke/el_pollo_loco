class ThrownObject extends MovableObject {
    width = 400 / 5;
    height = 400 / 5;
    speedY = 0;
    acceleration = 2.5;
    IMAGES_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];
    throw_sound = new Audio('audio/throw.mp3');
    break_sound = new Audio('audio/bottle_break.mp3');

    constructor(x, y, world) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);

        this.x = x;
        this.y = y;

        this.world = world;

        // this.animate();
    }

    throw(otherDirection = false) {
        let sgn = otherDirection ? -1 : 1;
        this.speedY = 20;
        this.applyGravity();
        let fly = setInterval(() => {
            this.x += sgn * 10;
        }, 25);
        this.throw_sound.play();
        setInterval(() => {
            this.world.level.enemies.forEach(enemy => {
                if (this.isColliding(enemy)) {
                    this.throw_sound.pause();
                    this.break_sound.play();
                    this.stopGravity();
                    clearInterval(fly);
                    this.playAnimation(this.IMAGES_SPLASH);
                }
            });
        }, 50);
    }

    // animate() {
    //     setInterval(() => {
    //         if (this.world.keyboard.D && !this.isAboveGround()) {
    //             this.throw();
    //         }
    //     }, 1000 / 60);
    // }
}