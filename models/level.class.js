class Level {
    enemies;
    clouds;
    backgroundObjects;
    thrownObjects;// todo: in world definieren?
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