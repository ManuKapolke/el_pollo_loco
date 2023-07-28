/*--------------------------------------------------
Keyboard
---------------------------------------------------*/
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
            e.preventDefault(); // for not toggling sound/music
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


/*--------------------------------------------------
Touchkeys
---------------------------------------------------*/
function provideTouchKeysForMobileDevices() {
    if (!isTouchDevice()) return;
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