class Level {
    enemies;
    endboss;
    clouds;
    backgroundObjects;
    // collectableObjects;
    bottles;
    coins;
    level_start_x = WORLD_START;
    level_end_x = WORLD_END;

    // constructor(enemies, clouds, backgroundObjects) {
    //     this.enemies = enemies;
    //     this.clouds = clouds;
    //     this.backgroundObjects = backgroundObjects;
    // }

    getCollectableObjects() {
        return this.bottles.concat(this.coins);
    }
}