/*--------------------------------------------------
Sound
---------------------------------------------------*/
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


/*--------------------------------------------------
Info
---------------------------------------------------*/
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


/*--------------------------------------------------
Fullscreen
---------------------------------------------------*/
function toggleFullscreen() {
    if (fullscreenIsActive) {
        closeFullscreen();
    } else {
        openFullscreen();
    }
    resizeCanvasContent();
    fullscreenIsActive = !fullscreenIsActive;
}


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