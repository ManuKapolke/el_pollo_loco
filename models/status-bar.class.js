class StatusBar extends DrawableObject {
    width = 595 / 3;
    height = 158 / 3;
    dirName;
    color = 'green';
    IMAGES = [];
    percentage;

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
        let index = Math.ceil(this.percentage / 20);
        return Math.min(index, 5);
    }
}