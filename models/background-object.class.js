class BackgroundObject extends MovableObject {
    width = CANVAS_WIDTH;
    height = CANVAS_HEIGHT;

    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = CANVAS_HEIGHT - this.height;
    }
}