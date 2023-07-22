class DrawableObject {
    x;
    y;
    width;
    height;
    img;
    imageCache = {};
    numberOfImagesToLoad;
    numberOfLoadedImages = 0;
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
        this.img.onload = () => {
            this.numberOfLoadedImages++;
            // if (this.allImagesAreLoaded()) {
            //     console.log('all images are loaded', this);
            // }
        };
    }

    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
            img.onload = () => {
                this.numberOfLoadedImages++;
                // if (this.allImagesAreLoaded()) {
                //     console.log('all images are loaded', this);
                // }
            };
        });
    }

    allImagesAreLoaded() {
        return this.numberOfImagesToLoad === this.numberOfLoadedImages;
    }

    draw(ctx) {
        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch (e) {
            console.warn('Error drawing image', e);
            console.log('Unable to draw image ', this.img.src);
        }
    }

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof CollectableObject) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'red';
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - (this.offset.left + this.offset.right), this.height - (this.offset.top + this.offset.bottom));
            ctx.stroke();
        }
    }

    overlapsWithOtherObjects(objects) {
        let foundOverlap = false;

        objects.forEach((obj) => {
            if (this === obj) return;
            if (this.isOverlapping(obj)) {
                foundOverlap = true;
            }
        });

        return foundOverlap;
    }

    isOverlapping(obj) {
        return this.x + this.width - this.offset.right > obj.x + obj.offset.left &&
            this.x + this.offset.left < obj.x + obj.width - obj.offset.right &&
            this.y + this.height - this.offset.bottom > obj.y + obj.offset.top &&
            this.y + this.offset.top < obj.y + obj.height - obj.offset.bottom;
    }

    isInLeftHalfOfCanvas() {
        return this.x < -this.world.camera_x + 0.5 * (CANVAS_WIDTH - this.width);
    }

    isInRightHalfOfCanvas() {
        return this.x > -this.world.camera_x + 0.5 * (CANVAS_WIDTH - this.width);
    }

    isInStartCanvas() {
        return 0 < this.x && this.x < CANVAS_WIDTH;
    }
}