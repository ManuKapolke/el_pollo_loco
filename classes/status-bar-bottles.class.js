class StatusBarBottles extends StatusBar {
    x = 20;
    y = 80;
    dirName = '1_statusbar/3_statusbar_bottle';
    color = 'orange';
    percentage = 100;

    constructor() {
        super();
        this.pushImages(this.dirName, this.color);
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage);
    }
}