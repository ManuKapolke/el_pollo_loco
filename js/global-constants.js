const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 480;
const MOST_LEFT_BG = -2;
const MOST_RIGHT_BG = 2;
const NUMBER_OF_BG = MOST_RIGHT_BG - MOST_LEFT_BG + 1;
const WORLD_START = MOST_LEFT_BG * CANVAS_WIDTH;
const WORLD_END = (MOST_RIGHT_BG + 1) * CANVAS_WIDTH - 1;
const WORLD_WIDTH = NUMBER_OF_BG * CANVAS_WIDTH;