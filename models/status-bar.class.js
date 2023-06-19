class StatusBar extends DrawableObject {
    width = 595 / 3;
    height = 158 / 3;
    dirName;
    color = 'green';
    IMAGES = [];
    percentage;

    // constructor() {
    //     super();
    //     this.pushImages(this.dirName, this.color);
    //     this.loadImages(this.IMAGES);
    //     this.setPercentage(this.percentage);
    // }

    pushImages(dirName, color) {
        [0, 20, 40, 60, 80, 100].forEach(status => {
            let path = `img/7_statusbars/1_statusbar/${dirName}/${color}/${status}.png`;
            this.IMAGES.push(path);
        });
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        return Math.ceil(this.percentage / 20);
    }
}