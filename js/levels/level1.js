let level1 = new Level();


async function initLevel() {
    level1.numberOfClouds = Math.floor(NUMBER_OF_BG / 2);
    level1.numberOfChickens = 10;
    level1.numberOfBabyChickens = 5;
    level1.numberOfBottles = 20;
    level1.numberOfCoins = 20;

    initLevelBackground();
    initLevelEnemies();
    initLevelCollectableObjects();
}


function initLevelBackground() {
    level1.backgroundObjects = [];
    level1.clouds = Array(level1.numberOfClouds).fill().map(() => new Cloud());

    createBackgroundObjectsForLevel1();
    setStartPointsForClouds();
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


function setStartPointsForClouds() {
    for (let i = 0; i < level1.numberOfClouds; i++) {
        level1.clouds[i].x = (MOST_LEFT_BG + 2 * i + 1) * CANVAS_WIDTH + Math.random() * 500;
    }
}


function initLevelEnemies() {
    let chickens = Array(level1.numberOfChickens).fill().map(() => new Chicken());
    let babyChickens = Array(level1.numberOfBabyChickens).fill().map(() => new BabyChicken());

    level1.enemies = [
        ...chickens,
        ...babyChickens,
        new Endboss()
    ];

    level1.endboss = level1.enemies.at(-1);
}


function initLevelCollectableObjects() {
    level1.bottles = Array(level1.numberOfBottles).fill().map(() => new CollectableBottle());
    level1.coins = Array(level1.numberOfCoins).fill().map(() => new CollectableCoin());

    level1.replaceOverlappingCollectableObjects();
}