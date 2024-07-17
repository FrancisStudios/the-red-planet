import FSCanvasEngine from "../src/main.js";
import config from '../config/config.json' with { type: 'json'};


const FSCE = FSCanvasEngine.getInstance();

/* Basic canvas setup with app height and width */
FSCE.setupScreen('screen', config.App.window.width, config.App.window.height);

/* Initialize game state */
FSCE.initGameState();

/* Load Image (only after initGameState()) */
//FSCE.loadImage('test.png'); /* TODO: not load image instead create a block or sprite */

FSCE.gameLoop(() => {
    console.log('frame')
}, true);