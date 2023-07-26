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

const audioFiles = [
    'assets/audio/music/endboss-appears.mp3',
    'assets/audio/music/game-bg.mp3',
    'assets/audio/music/lost.mp3',
    'assets/audio/music/won.mp3',
    'assets/audio/baby-chicken_dead.mp3',
    'assets/audio/bottle_break.mp3',
    'assets/audio/bottle_collect.mp3',
    'assets/audio/chicken_dead.mp3',
    'assets/audio/coin.mp3',
    'assets/audio/dead.mp3',
    'assets/audio/endboss_alert.mp3',
    'assets/audio/endboss_attack.mp3',
    'assets/audio/endboss_dead.mp3',
    'assets/audio/endboss_hurt.mp3',
    'assets/audio/endboss_walk.mp3',
    'assets/audio/game-over.mp3',
    'assets/audio/hurt.mp3',
    'assets/audio/jump_voice.mp3',
    'assets/audio/nothrow.mp3',
    'assets/audio/running.mp3',
    'assets/audio/sleep.mp3',
    'assets/audio/smash.mp3',
    'assets/audio/throw.mp3'
];
const audioElements = {};


function preloadAudioElements() {
    audioFiles.forEach(path => {
        let audio = new Audio(path);
        audio.preload = 'auto';
        audio.load();
        audioElements[path] = audio;
    });
}

async function init() {
    await loadSoundSettingFromLocalStorage();
    setSoundIcon();
    resizeCanvasContent();
    preloadAudioElements();
}



async function startGame() {
    try {
        showElement('loader');
        removeStartScreen();
        // Simulate a short delay so that the loader can spin a bit
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Simulate asynchronous operations using Promises
        await Promise.all([initLevel(), initWorld()]);
        gameIsRunning = true;
    } catch (error) {
        console.error("An error occurred while starting the game:", error);
    } finally {
        // Ensure that the loader element is removed, even if there's an error, but only when all relevant images are loaded
        let checkLoading = setInterval(() => {
            world.checkIfAllImagesAreLoaded();
            if (world.allImagesAreLoaded) {
                clearInterval(checkLoading);
                removeElement('loader');
                provideTouchKeysForMobileDevices();
            }
        }, 50);

    }
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
    setAllAudioElementsToBeginning();
    removeEndScreen();
    startGame();
    gameIsLost = false;
    gameIsWon = false;
}


function setAllAudioElementsToBeginning() {
    audioFiles.forEach(path => {
        audioElements[path].currentTime = 0;
    });
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


function aKeyIsPressed() {
    return keyboard.LEFT || keyboard.RIGHT || keyboard.UP || keyboard.DOWN || keyboard.SPACE || keyboard.D;
}


function provideTouchKeysForMobileDevices() {
    // if (!isTouchDevice()) return;
    // if(!isMobileDevice()) return;

    showElement('touch-keys');
    handleTouchKeys();
}


function handleTouchKeys() {
    synchronizeTouchKeyWithKeyboardKey('touch-key-left', 'LEFT');
    synchronizeTouchKeyWithKeyboardKey('touch-key-right', 'RIGHT');
    synchronizeTouchKeyWithKeyboardKey('touch-key-jump', 'UP');
    synchronizeTouchKeyWithKeyboardKey('touch-key-throw', 'D');
}


function synchronizeTouchKeyWithKeyboardKey(touchKeyId, keyName) {
    const touchKey = document.getElementById(touchKeyId);
    touchKey.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchKey.style.background = '#a0220a80';
        keyboard[keyName] = true;
    });
    touchKey.addEventListener('touchend', (e) => {
        e.preventDefault();
        touchKey.style.background = 'linear-gradient(to bottom, #ef8b10, #ffc521)';
        keyboard[keyName] = false;

        keyboard.lastKeyPress = new Date().getTime();
    });
}




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

    document.getElementById('touch-keys').classList.toggle('full-opacity');

    if (gameIsRunning) return;

    if (gameIsLost) {
        toggleEndScreen('end-screen-lost');
    }
    else if (gameIsWon) {
        toggleEndScreen('end-screen-won');
    }
    else {// game has not been started
        document.getElementById('play-btn').classList.toggle('d-none');
    }
}


function toggleEndScreen(screenId) {
    document.getElementById(screenId).classList.toggle('full-opacity');
    document.getElementById('replay-btn-screen').classList.toggle('full-opacity');
    document.getElementById('replay-btn-screen').style.zIndex = (+document.getElementById('replay-btn-screen').style.zIndex + 1) % 2;
}


/* Toggle fullscreen */
function toggleFullscreen() {
    if (fullscreenIsActive) {
        closeFullscreen();
    } else {
        openFullscreen();
    }
    resizeCanvasContent();
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

    document.getElementById('fullscreen-btn-icon').src = 'assets/img/fullscreen_exit.png';
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

    document.getElementById('fullscreen-btn-icon').src = 'assets/img/fullscreen.png';
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
    resizeTouchKeys();
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


function resizeTouchKeys() {
    const touchKeyContainer = document.getElementById('touch-keys');
    const touchKeyContainerLeft = document.getElementById('touch-keys-lefthand');
    const touchKeyContainerRight = document.getElementById('touch-keys-righthand');
    const touchKeys = document.getElementsByClassName('touch-key');

    touchKeyContainer.style.padding = `${0.015 * getCanvasWidth()}px ${0.045 * getCanvasWidth()}px`;
    touchKeyContainerLeft.style.gap = `${0.05 * getCanvasWidth()}px`;
    touchKeyContainerRight.style.gap = `${0.05 * getCanvasWidth()}px`;

    Array.from(touchKeys).forEach((key) => {
        key.style.width = `${0.16 * getCanvasHeight()}px`;
        key.style.height = `${0.16 * getCanvasHeight()}px`;
    });
}


function getCanvasWidth() {
    let width = fullscreenIsActive ? window.innerWidth :
        Math.min(CANVAS_WIDTH, window.innerWidth, window.innerHeight * 3 / 2);
    return width;
}


function getCanvasHeight() {
    let height = fullscreenIsActive ? window.innerHeight :
        Math.min(CANVAS_HEIGHT, window.innerHeight, window.innerWidth * 2 / 3);
    return height;
}





/*--------------------------------------------------
Detect Touchscreen/Mobile Device
---------------------------------------------------*/
function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}


function isMobileDevice() {
    let isMobile = navigator.userAgentData?.mobile;
    if (isMobile === undefined) {
        isMobile = window.mobileAndTabletCheck();
    }
    return isMobile;
}


window.mobileAndTabletCheck = function () {
    let check = false;
    (function (a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
        )
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};