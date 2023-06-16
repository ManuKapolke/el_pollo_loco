let canvas;
let world;
let keyboard = new Keyboard();
let fullscreenIsActive = false;

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            keyboard.LEFT = true;
            break;
        case 'ArrowRight':
            keyboard.RIGHT = true;
            break;
        case 'ArrowUp':
            keyboard.UP = true;
            break;
        case 'ArrowDown':
            keyboard.DOWN = true;
            break;
        case ' ':
            keyboard.SPACE = true;
            break;
        case 'd':
            keyboard.D = true;
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            keyboard.LEFT = false;
            break;
        case 'ArrowRight':
            keyboard.RIGHT = false;
            break;
        case 'ArrowUp':
            keyboard.UP = false;
            break;
        case 'ArrowDown':
            keyboard.DOWN = false;
            break;
        case ' ':
            keyboard.SPACE = false;
            break;
        case 'd':
            keyboard.D = false;
            break;
    }
});


/* Alternative (quick and dirty), um alle Intervalle zu beenden. */
function clearAllIntervals() {
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
}


/* Toggle fullscreen */
function toggleFullscreen() {
    if (fullscreenIsActive) {
        closeFullscreen();
    } else {
        openFullscreen();
    }
    fullscreenIsActive = !fullscreenIsActive;
}

/* Open fullscreen */
function openFullscreen() {
    let elem = document.getElementById('fullscreen');
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }

    canvas.width = 720;
    canvas.height = 480;
}