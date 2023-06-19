class CollectableCoin extends CollectableObject {
    y = 350;
    width = 300 / 3;
    height = 301 / 3;
    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];
    offset = {
        top: 0.3 * this.height,
        right: 0.3 * this.width,
        bottom: 0.3 * this.height,
        left: 0.3 * this.width
    };
    collect_sound = new Audio('audio/coin.mp3');

    constructor() {
        super().loadImage(this.IMAGES[1]);

        this.x = (WORLD_START + 200) + Math.random() * WORLD_WIDTH;
        this.y = 100 + Math.random() * 250;
    }
}