class CollectableObject extends DrawableObject {
    IMAGES;
    collect_sound;

    place() {
        do {
            this.x = (WORLD_START + 200) + Math.random() * (WORLD_WIDTH - CANVAS_WIDTH);
        } while (this.isInStartCanvas());
    }
}