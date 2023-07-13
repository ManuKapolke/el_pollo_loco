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

async function init() {
    await loadSoundSettingFromLocalStorage();
    setSoundIcon();
}

function startGame() {
    showElement('loader');
    initLevel();
    initWorld();
    removeStartScreen();
    gameIsRunning = true;
    setTimeout(() => {
        removeElement('loader');
    }, 1000);

}

function initWorld() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

function restartGame() {
    clearAllIntervals();
    intervalIds = [];
    world.gameLost_music.pause();
    world.gameWon_music.pause();
    removeEndScreen();
    startGame();
    gameIsLost = false;
    gameIsWon = false;
}

function removeStartScreen() {
    removeElement('play-btn');
    removeOpacity('play-btn-screen');
    removeOpacity('start-screen');
    setTimeout(() => {
        removeElement('start-screen');
    }, 500);
}

function removeEndScreen() {
    const endScreenId = gameIsLost ? 'end-screen-lost' : 'end-screen-won';

    document.getElementById('replay-btn-screen').style.zIndex = 0;
    // removeElement('replay-btn');
    removeOpacity('replay-btn-screen');

    removeOpacity(endScreenId);
    setTimeout(() => {
        removeElement(endScreenId);
    }, 500);
}

function showEndScreen(endScreenId) {
    showElement(endScreenId);
    addOpacity(endScreenId);
    showElement('replay-btn-screen');
    // showElement('replay-btn');
    addOpacity('replay-btn-screen');
    document.getElementById('replay-btn-screen').style.zIndex = 1;

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
    if (musicIsOn) {
        musicIsOn = false;
    }
    else if (soundIsOn) {
        soundIsOn = false;
    }
    else {
        musicIsOn = true;
        soundIsOn = true;
    }
    setSoundIcon();
    saveSoundSettingToLocalStorage();
}


function setSoundIcon() {
    const soundIcon = document.getElementById('sound-btn-icon');
    if (musicIsOn) {
        soundIcon.src = 'assets/img/sounds-and-music.png';
        soundIcon.style.width = '32px';
    }
    else if (soundIsOn) {
        soundIcon.src = 'assets/img/sounds-without-music.png';
        soundIcon.style.width = '28px';
    }
    else {
        soundIcon.src = 'assets/img/sounds-off.png';
        soundIcon.style.width = '28px';
    }
}




function toggleGameInfo() {
    document.getElementById('info-screen').classList.toggle('full-opacity');

    if (gameIsRunning) return;

    if (gameIsLost) {
        document.getElementById('end-screen-lost').classList.toggle('full-opacity');
        document.getElementById('replay-btn-screen').classList.toggle('full-opacity');
        document.getElementById('replay-btn-screen').style.zIndex = (+document.getElementById('replay-btn-screen').style.zIndex + 1) % 2;
    }
    else if (gameIsWon) {
        document.getElementById('end-screen-won').classList.toggle('full-opacity');
        document.getElementById('replay-btn-screen').classList.toggle('full-opacity');
        document.getElementById('replay-btn-screen').style.zIndex = (+document.getElementById('replay-btn-screen').style.zIndex + 1) % 2;
    }
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

function removeOpacity(id) {
    document.getElementById(id).classList.remove('full-opacity');
}

function addOpacity(id) {
    document.getElementById(id).classList.add('full-opacity');
}

function saveSoundSettingToLocalStorage() {
    localStorage.setItem('musicIsOn', JSON.stringify(musicIsOn));
    localStorage.setItem('soundIsOn', JSON.stringify(soundIsOn));
}


async function loadSoundSettingFromLocalStorage() {
    musicIsOn = JSON.parse(localStorage.getItem('musicIsOn') || true);
    soundIsOn = JSON.parse(localStorage.getItem('soundIsOn') || true);
}