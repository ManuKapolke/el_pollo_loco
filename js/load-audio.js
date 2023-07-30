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


function setAllAudioElementsToBeginning() {
    audioFiles.forEach(path => {
        audioElements[path].currentTime = 0;
    });
}


function saveSoundSettingToLocalStorage() {
    localStorage.setItem('musicIsOn', JSON.stringify(musicIsOn));
    localStorage.setItem('soundIsOn', JSON.stringify(soundIsOn));
}


async function loadSoundSettingFromLocalStorage() {
    musicIsOn = JSON.parse(localStorage.getItem('musicIsOn') || true);
    soundIsOn = JSON.parse(localStorage.getItem('soundIsOn') || true);
}