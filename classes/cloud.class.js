class Cloud extends MovableObject {
    y = 0;
    width = 1920 / 3;
    height = 1080 / 3;
    numberOfImagesToLoad = 1;

    constructor() {
        super().loadImage('assets/img/5_background/layers/4_clouds/1.png');
        this.animate();
    }

    animate() {
        setStoppableInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
    }
}