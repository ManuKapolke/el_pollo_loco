class StatusBarEndboss extends StatusBar {
    x = CANVAS_WIDTH - (674 / 3.5 + 16);
    y = 70;
    width = 674 / 3.5;
    height = 165 / 3.5;
    dirName = '2_statusbar_endboss';
    color = 'green';
    percentage = 100;

    constructor() {
        super();
        this.pushImages(this.dirName, this.color);
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage);
    }
}