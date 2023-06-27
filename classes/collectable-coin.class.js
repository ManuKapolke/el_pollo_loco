class CollectableCoin extends CollectableObject {
    y = 350;
    width = 300 / 3;
    height = 301 / 3;
    IMAGES = [
        'assets/img/8_coin/coin_1.png',
        'assets/img/8_coin/coin_2.png'
    ];
    offset = {
        top: 0.3 * this.height,
        right: 0.3 * this.width,
        bottom: 0.3 * this.height,
        left: 0.3 * this.width
    };
    collect_sound = new Audio('assets/audio/coin.mp3');

    constructor() {
        super().loadImage(this.IMAGES[1]);

        this.x = (WORLD_START + 200) + Math.random() * WORLD_WIDTH - CANVAS_WIDTH;
        this.y = 100 + Math.random() * 250;
    }
}