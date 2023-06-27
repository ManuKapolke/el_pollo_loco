class StatusBarEndboss extends StatusBar {
    x = 500;
    y = 20;
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