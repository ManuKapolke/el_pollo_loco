class Level {
    backgroundObjects;
    clouds;
    numberOfClouds;
    enemies;
    numberOfChickens;
    numberOfBabyChickens;
    endboss;
    bottles;
    coins;
    numberOfBottles;
    numberOfCoins;
    level_start_x = WORLD_START;
    level_end_x = WORLD_END;

    replaceOverlappingCollectableObjects() {
        let objects = this.getCollectableObjects();

        objects.forEach((obj) => {
            while (obj.overlapsWithOtherObjects(objects)) {
                obj.place();
            }
        });
    }

    getCollectableObjects() {
        return [...this.bottles, ...this.coins];
    }
}