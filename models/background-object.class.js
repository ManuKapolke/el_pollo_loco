class BackgroundObject extends DrawableObject {
    width = CANVAS_WIDTH + 1;
    height = CANVAS_HEIGHT;

    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = CANVAS_HEIGHT - this.height;
    }
}