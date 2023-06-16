class CollectableObject extends DrawableObject {
    y = 350;
    width = 400 / 5;
    height = 400 / 5;
    IMAGES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor() {
        let randomIndex = Math.round(Math.random());
        super().loadImage(this.IMAGES[randomIndex]);

        this.x = WORLD_START + Math.random() * WORLD_WIDTH;
    }
}