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
    resizeCanvasContent();
}


async function startGame() {
    showElement('loader');

    setTimeout(async function () {
        removeStartScreen();
        await initLevel();
        await initWorld();
        gameIsRunning = true;
    }, 500);

    setTimeout(() => {
        removeElement('loader');
    }, 2000);
}


async function initWorld() {
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
    }
    else if (soundIsOn) {
        soundIcon.src = 'assets/img/sounds-without-music.png';
    }
    else {
        soundIcon.src = 'assets/img/sounds-off.png';
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


/*--------------------------------------------------
Responsiveness
---------------------------------------------------*/
window.addEventListener('resize', resizeCanvasContent);


function resizeCanvasContent() {
    resizeMenuBar();
    resizePlayButton();
    resizeReplayButton();
    resizeEndScreen();
    resizeInfoScreen();
    // resizeLoader();
}


function resizeMenuBar() {
    const menuBar = document.getElementById('menu-bar');
    menuBar.style.gap = `${0.045 * getCanvasWidth()}px`;
    menuBar.style.top = `${0.03 * getCanvasWidth()}px`;
    menuBar.style.right = `${0.03 * getCanvasWidth()}px`;

    resizeSoundIcon();
    resizeInfoIcon();
    resizeFullscreenIcon();
}


function resizeSoundIcon() {
    const soundIcon = document.getElementById('sound-btn-icon');
    if (musicIsOn) {
        soundIcon.style.width = `${0.045 * getCanvasWidth()}px`;
    }
    else {
        soundIcon.style.width = `${0.04 * getCanvasWidth()}px`;
    }
}


function resizeInfoIcon() {
    const infoIcon = document.getElementById('info-btn-icon');
    infoIcon.style.width = `${0.045 * getCanvasWidth()}px`;
}


function resizeFullscreenIcon() {
    const fullscreenIcon = document.getElementById('fullscreen-btn-icon');
    fullscreenIcon.style.width = `${0.04 * getCanvasWidth()}px`;
}


function resizePlayButton() {
    const playBtn = document.getElementById('play-btn-img');
    playBtn.style.width = `${0.4 * getCanvasWidth()}px`;
}


function resizeReplayButton() {
    const replayBtn = document.getElementById('replay-btn');
    replayBtn.style.fontSize = `${0.056 * getCanvasWidth()}px`;
}


function resizeEndScreen() {
    const endScreenWon = document.getElementById('end-screen-won');
    const endScreenCircle = document.getElementById('end-screen-circle');
    endScreenWon.style.fontSize = `${0.29 * getCanvasHeight()}px`;
    endScreenCircle.style.width = `${0.5 * getCanvasHeight()}px`;
    endScreenCircle.style.height = `${0.5 * getCanvasHeight()}px`;
}


function resizeInfoScreen() {
    const infoContent = document.getElementById('info-content');
    infoContent.style.fontSize = `${0.06 * getCanvasHeight()}px`;

    resizeInfoScreenIcons();
}


function resizeInfoScreenIcons() {
    const iconCell = document.getElementsByClassName('icon-td');
    Array.from(iconCell).forEach((cell) => {
        cell.style.height = `${0.0888 * getCanvasWidth()}px`;
        cell.style.paddingRight = `${0.111 * getCanvasWidth()}px`;
        cell.style.paddingLeft = `${0.0111 * getCanvasWidth()}px`;
    });

    resizeInfoScreenKeys();
    resizeInfoScreenSoundOptions();
}


function resizeInfoScreenKeys() {
    const keys = document.getElementsByClassName('key');
    const keySeparator = document.getElementById('key-separator');

    Array.from(keys).forEach((key) => {
        key.style.width = `${0.1 * getCanvasHeight()}px`;
        key.style.height = `${0.1 * getCanvasHeight()}px`;
        key.style.fontSize = `${0.045 * getCanvasWidth()}px`;
    });

    keySeparator.style.fontSize = `${0.1 * getCanvasHeight()}px`;
    keySeparator.style.marginLeft = `${0.033 * getCanvasHeight()}px`;
    keySeparator.style.marginRight = `${0.033 * getCanvasHeight()}px`;
}


function resizeInfoScreenSoundOptions() {
    const soundOptions = document.getElementsByClassName('sound-option');
    const soundDescription = document.getElementById('sound-description-text');

    Array.from(soundOptions).forEach((so) => {
        so.style.width = `${0.1 * getCanvasHeight()}px`;
        so.style.height = `${0.1 * getCanvasHeight()}px`;
    });

    soundDescription.marginBottom = `${0.033 * getCanvasHeight()}px`;
}


function resizeLoader() {
    const loader = document.getElementById('loader-img');
    loader.style.borderLeftWidth = `${0.02 * getCanvasWidth()}`;
    loader.style.borderRightWidth = `${0.02 * getCanvasWidth()}`;
}


function getCanvasWidth() {
    return Math.min(CANVAS_WIDTH, window.innerWidth, window.innerHeight * 3 / 2);
}


function getCanvasHeight() {
    return Math.min(CANVAS_HEIGHT, window.innerHeight, window.innerWidth * 2 / 3);
}