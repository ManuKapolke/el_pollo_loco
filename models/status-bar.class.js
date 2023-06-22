class StatusBar extends DrawableObject {
    width = 595 / 4;
    height = 158 / 4;
    dirName;
    color = 'green';
    IMAGES = [];
    percentage;

    pushImages(dirName, color) {
        [0, 20, 40, 60, 80, 100].forEach(status => {
            let path = `img/7_statusbars/${dirName}/${color}/${status}.png`;
            this.IMAGES.push(path);
        });
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        let index = Math.ceil(this.percentage / 20);
        return Math.min(index, 5);
    }
}