class Level {
    enemies;
    endboss;
    clouds;
    backgroundObjects;
    // collectableObjects;
    bottles;
    coins;
    numberOfBottles;
    numberOfCoins;
    numberOfClouds;
    level_start_x = WORLD_START;
    level_end_x = WORLD_END;

    // constructor(enemies, clouds, backgroundObjects) {
    //     this.enemies = enemies;
    //     this.clouds = clouds;
    //     this.backgroundObjects = backgroundObjects;
    // }

    replaceOverlappingCollectableObjects() {
        let objects = this.getCollectableObjects();

        objects.forEach((obj) => {
            while (obj.overlapsWithOtherObjects(objects)) {
                obj.place();
            }
        });
    }

    getCollectableObjects() {
        // return this.bottles.concat(this.coins);
        return [...this.bottles, ...this.coins];
    }


}