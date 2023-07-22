class CollectableCoin extends CollectableObject {
    y = 350;
    width = 300 / 3;
    height = 301 / 3;
    IMAGES = [
        'assets/img/8_coin/coin_1.png',
        'assets/img/8_coin/coin_2.png'
    ];
    numberOfImagesToLoad = 1;
    offset = {
        top: 0.3 * this.height,
        right: 0.3 * this.width,
        bottom: 0.3 * this.height,
        left: 0.3 * this.width
    };
    collect_sound = new Audio('assets/audio/coin.mp3');

    constructor() {
        super().loadImage(this.IMAGES[1]);

        this.place();
    }

    place() {
        super.place();
        this.y = 100 + Math.random() * 250;
    }
}