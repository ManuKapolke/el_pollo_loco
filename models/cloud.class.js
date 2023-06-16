class Cloud extends MovableObject {
    y = 0;
    width = 1920 / 3;
    height = 1080 / 3;

    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        this.x = Math.random() * 500;
        this.animate();
    }


    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}