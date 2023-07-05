let canvas;
let world;
let keyboard = new Keyboard();
let fullscreenIsActive = false;
let musicIsOn = true;
let soundIsOn = true;
let intervalIds = [];
let gameIsRunning = false;
let gameIsLost = false;
let gameIsWon = false;

function startGame() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);

    document.getElementById('play-btn').classList.add('d-none');
    document.getElementById('play-btn-screen').classList.remove('full-opacity');
    document.getElementById('start-screen').classList.remove('full-opacity');
    setTimeout(() => {
        document.getElementById('start-screen').classList.add('d-none');
    }, 500);

    gameIsRunning = true;
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
            e.preventDefault();// damit sound/music nicht getoggelt wird
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

    keyboard.lastKeyPress = new Date().getTime();
});


function setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    intervalIds.push(id);
    return id;
}


function clearStoppableIntervals() {
    intervalIds.forEach(clearInterval);
}


/* Alternative (quick and dirty), um alle Intervalle zu beenden. */
function clearAllIntervals() {
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
}


function toggleSoundAndMusic() {
    const soundIcon = document.getElementById('sound-btn-icon');
    if (musicIsOn) {
        musicIsOn = false;
        soundIcon.src = 'assets/img/sounds-without-music.png';
        soundIcon.style.width = '28px';
    }
    else if (soundIsOn) {
        soundIsOn = false;
        soundIcon.src = 'assets/img/sounds-off.png';
        soundIcon.style.width = '28px';
    }
    else {
        musicIsOn = true;
        soundIsOn = true;
        soundIcon.src = 'assets/img/sounds-and-music.png';
        soundIcon.style.width = '32px';
    }
}


function toggleGameInfo() {
    document.getElementById('info-screen').classList.toggle('full-opacity');

    if (gameIsRunning) return;

    if (gameIsLost) {
        document.getElementById('end-screen-lost').classList.toggle('full-opacity');
    }
    // else if (gameIsWon) {
    //     document.getElementById('end-screen-won').classList.toggle('full-opacity');
    // }
    else {// game has not been started
        document.getElementById('play-btn').classList.toggle('d-none');
    }
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
    let elem = document.getElementById('main-screen-container');
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



/*--------------------------------------------------
Show / Hide
---------------------------------------------------*/
/**
 * Function to show an element with a given ID by removing the 'd-none' and 'hidden' classes.
 * @param {string} id - The ID of the element to show.
 */
function showElement(id) {
    document.getElementById(id).classList.remove('d-none');
    document.getElementById(id).classList.remove('hidden');
}

/**
 * Function to hide an element with a given ID by adding the 'hidden' class.
 * @param {string} id - The ID of the element to hide.
 */
function hideElement(id) {
    document.getElementById(id).classList.add('hidden');
}

/**
 * Function to remove an element with a given ID by adding the 'd-none' class.
 * @param {string} id - The ID of the element to remove.
 */
function removeElement(id) {
    document.getElementById(id).classList.add('d-none');
}