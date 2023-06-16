let level1;


function initLevel() {
    level1 = new Level();

    level1.enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss()
    ];

    level1.clouds = [
        new Cloud()
    ];

    level1.throwableObjects = [];

    level1.collectableObjects = [
        new CollectableObject(),
        new CollectableObject(),
        new CollectableObject(),
        new CollectableObject(),
        new CollectableObject()
    ];

    level1.backgroundObjects = [];

    createBackgroundObjectsForLevel1();

    // document.getElementById('start-btn').disabled = true;
}


function createBackgroundObjectsForLevel1() {
    for (let i = MOST_LEFT_BG; i < MOST_RIGHT_BG; i++) {
        let bg = i * (CANVAS_WIDTH - 1);
        let pngNumber = (i % 2) ? '1' : '2';
        level1.backgroundObjects.push(new BackgroundObject('img/5_background/layers/air.png', bg));
        level1.backgroundObjects.push(new BackgroundObject(`img/5_background/layers/3_third_layer/${pngNumber}.png`, bg));
        level1.backgroundObjects.push(new BackgroundObject(`img/5_background/layers/2_second_layer/${pngNumber}.png`, bg));
        level1.backgroundObjects.push(new BackgroundObject(`img/5_background/layers/1_first_layer/${pngNumber}.png`, bg));
    }
}
