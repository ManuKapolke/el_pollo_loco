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