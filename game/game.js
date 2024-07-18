import FSCanvasEngine from "../src/main.js";
import config from '../config/config.json' with { type: 'json'};


const FSCE = FSCanvasEngine.getInstance();

/* Basic canvas setup with app height and width */
FSCE.setupScreen('screen', config.App.window.width, config.App.window.height);

/* Initialize game state */
FSCE.initGameState(32);

/* Build a Texture then build a block */
const testTexture = FSCE.buildTexture('32-test-texture.png', 'test-texture');

FSCE.buildBlock('test-block', testTexture, { x: 10, y: 10 });
FSCE.createLayer('test');

FSCE.gameLoop(() => {
    //console.log('frame')
}, true);