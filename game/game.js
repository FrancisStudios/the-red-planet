import FSCanvasEngine from "../src/main.js";
import config from '../config/config.json' with { type: 'json'};

/* Getting an instance of FSCE */
const FSCE = FSCanvasEngine.getInstance();

/* Setting up game screen */
FSCE.setupScreen('screen', config.App.window.width, config.App.window.height);

/* Initialize game state with 32x32 blocks */
FSCE.initGameState(32);

/* Creating a layer */
FSCE.createLayer('test-layer');

/* Creating a texture = uploading /game/assets/img/32-test-... .png */
//FSCE.buildTexture('32-test-texture.png', 'test-texture');
FSCE.buildTexture('32-test-texture.png', 'test-texture');

/* Creating a block on 10:10 coordinates */
FSCE.buildBlock('test-block', FSCE.getTexture('test-texture'), { x: 10, y: 10 });

/* Getting block and moving on to the test-layer */
FSCE.insertToLayer(FSCE.getBlock('test-block'), 'test-layer');

/* Attach game controllers */
FSCE.attachGameController(FSCE.getBlock('test-block'));

/* Rendering */
FSCE.gameLoop(() => {
    // This gets called after each rendered frame
    //console.log(FSCE.getGameState());
}, true);