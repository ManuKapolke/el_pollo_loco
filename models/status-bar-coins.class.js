class StatusBarCoins extends StatusBar {
    x = 20;
    y = 45;
    dirName = '1_statusbar/1_statusbar_coin';
    color = 'blue';
    percentage = 0;

    constructor() {
        super();
        this.pushImages(this.dirName, this.color);
        this.loadImages(this.IMAGES);
        this.setPercentage(this.percentage);
    }
}