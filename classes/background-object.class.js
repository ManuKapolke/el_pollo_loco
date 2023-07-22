class BackgroundObject extends DrawableObject {
    width = CANVAS_WIDTH + 1;
    height = CANVAS_HEIGHT;
    numberOfImagesToLoad = 1;

    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = CANVAS_HEIGHT - this.height;
    }
}