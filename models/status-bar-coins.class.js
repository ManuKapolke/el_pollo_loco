class StatusBarCoins extends StatusBar {
    x = 250;
    y = 10;
    dirName = '1_statusbar_coin';
    color = 'blue';
    percentage = 0;

    constructor() {
        super();
        this.pushImages(this.dirName, this.color);
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage);
    }
}