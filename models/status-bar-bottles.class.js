class StatusBarBottles extends StatusBar {
    x = 480;
    y = 10;
    dirName = '3_statusbar_bottle';
    color = 'orange';
    percentage = 100;

    constructor() {
        super();
        this.pushImages(this.dirName, this.color);
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage);
    }
}