let level1;
let numberOfBottles = 10;
let numberOfCoins = 10;


function initLevel() {
    level1 = new Level();

    level1.enemies = [
        // new Chicken(),
        // new Chicken(),
        // new Chicken(),
        // new Chicken(),
        // new Chicken(),
        // new Chicken(),
        // new Chicken(),
        // new Chicken(),
        // new Chicken(),
        // new Chicken(),
        // new BabyChicken(),
        // new BabyChicken(),
        // new BabyChicken(),
        // new BabyChicken(),
        // new BabyChicken(),
        new Endboss()
    ];

    level1.endboss = level1.enemies.at(-1);

    level1.clouds = [
        new Cloud()
    ];

    level1.bottles = Array(numberOfBottles).fill().map(() => new CollectableBottle());

    level1.coins = Array(numberOfCoins).fill().map(() => new CollectableCoin());

    level1.backgroundObjects = [];

    createBackgroundObjectsForLevel1();

    // document.getElementById('start-btn').disabled = true;
}


function createBackgroundObjectsForLevel1() {
    for (let i = MOST_LEFT_BG; i <= MOST_RIGHT_BG; i++) {
        let bg_x = i * CANVAS_WIDTH;
        let pngNumber = (i % 2) ? '1' : '2';
        level1.backgroundObjects.push(new BackgroundObject('assets/img/5_background/layers/air.png', bg_x));
        level1.backgroundObjects.push(new BackgroundObject(`assets/img/5_background/layers/3_third_layer/${pngNumber}.png`, bg_x));
        level1.backgroundObjects.push(new BackgroundObject(`assets/img/5_background/layers/2_second_layer/${pngNumber}.png`, bg_x));
        level1.backgroundObjects.push(new BackgroundObject(`assets/img/5_background/layers/1_first_layer/${pngNumber}.png`, bg_x));
    }
}
