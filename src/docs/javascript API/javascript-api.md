# JavaScript API

It's a simplistic interface that you can use to build your own game. 

The main class you have to import from `/src/main.js` which has a default export of `FSCanvasEngine` class - which uses the singleton pattern to stay the **single source of truth** of the current program state (game state) as well as being the main interface to other classes

## 1 Instantiate the engine interface

```Javascript
const FSCE = FSCanvasEngine.getInstance();
```

You can instantiate the engine in multiple locations, and it will reach the same instance (as you would expect from a singleton class)

All methods are reachable through this class. See [all-methods.md](./all-methods.md) to see what's available.

## 2 Initialize screen
```Javascript
FSCE.setupScreen('screen', config.App.window.width, config.App.window.height);
```

`#screen` is the ID of the HTML canvas and the follwing two parameters are the width and height (int)number in pixels. To avoid bugs and mismatch, I recommend using the `config/config.json` file for  getting the window width and height.

```Javascript
import config from '../config/config.json' with { type: 'json'};
```

## 3 Initialize Game State

```Javascript
FSCE.initGameState();
```

This will build up an initial game state which will store all of your assets (blocks, sprites, audio) in later stages, your map data, and everythin important that's going on witin your game. You can create variables within the game state (like health, power, etc...) and access them via the appropriate methods. Consult [all-methods.md](./all-methods.md) to see what's available.


## 4 You can create your building blocks

Example block on the screen:

```Javascript
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
FSCE.buildTexture('32-test-texture.png', 'test-texture');

/* Creating a block on 10:10 coordinates */
FSCE.buildBlock('test-block', FSCE.getTexture('test-texture'), { x: 10, y: 10 });

/* Getting block and moving on to the test-layer */
FSCE.insertToLayer(FSCE.getBlock('test-block'), 'test-layer');

/* Rendering */
FSCE.gameLoop(() => {
    // This gets called after each rendered frame
}, true);
```

And with these simple steps you can put an image on the screen, just like that. 