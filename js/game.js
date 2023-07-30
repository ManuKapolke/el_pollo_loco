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
    preloadAudioElements();
}


/*--------------------------------------------------
Start / Restart
---------------------------------------------------*/
async function startGame() {
    try {
        await showLoader();
        removeStartScreen();
        await Promise.all([initLevel(), initWorld()]); // Simulate asynchronous operations using Promises
        provideTouchKeysForMobileDevices();
        gameIsRunning = true;
    } catch (error) {
        console.error("An error occurred while starting the game:", error);
    } finally {
        removeLoaderWhenAllImagesAreLoaded(); // Ensure that the loader element is removed, even if there's an error, but only when all relevant images are loaded
    }
}


async function showLoader() {
    showElement('loader');
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate a short delay so that the loader can spin a bit
}


function removeStartScreen() {
    removeElement('play-btn');
    removeOpacity('play-btn-screen');
    removeOpacity('start-screen');
    setTimeout(() => {
        removeElement('start-screen');
    }, 500);
}


async function initWorld() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}


function removeLoaderWhenAllImagesAreLoaded() {
    let checkLoading = setInterval(() => {
        world.checkIfAllImagesAreLoaded();
        if (world.allImagesAreLoaded) {
            clearInterval(checkLoading);
            removeElement('loader');
        }
    }, 50);
}


function restartGame() {
    clearAllIntervals();
    intervalIds = [];
    world.gameLost_music.pause();
    world.gameWon_music.pause();
    setAllAudioElementsToBeginning();
    removeEndScreen();
    startGame();
    gameIsLost = false;
    gameIsWon = false;
}


function removeEndScreen() {
    const endScreenId = gameIsLost ? 'end-screen-lost' : 'end-screen-won';

    document.getElementById('replay-btn-screen').style.zIndex = 0;
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
    addOpacity('replay-btn-screen');
    document.getElementById('replay-btn-screen').style.zIndex = 1;

}


/*--------------------------------------------------
Intervals
---------------------------------------------------*/
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