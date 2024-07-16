/**
 * This class is the main facade of the whole engine.
 * All application (and game) state is stored here and
 * processed in other classes and methods.
 */
import FSCanvasEngineRenderer from "./renderer/renderer.js";
export default class FSCanvasEngine {
    screen;
    cnv;
    isScreenSetup;
    gameState; /** @property { GameStateType } gameState */

    instance;
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new FSCanvasEngine();

        return this.instance;
    }

    /**
     * @param {string} id - ID of your HTML Canvas
     * @param {number} height - Height of your HTML Canvas in pixels
     * @param {number} width - Width of your HTML Canvas in pixels
     */
    setupScreen(id, width, height) {
        if (!this.isScreenSetup) {
            const canvas = document.getElementById(id);
            const context = canvas.getContext('2d');
            canvas.width = width; canvas.height = height;
            this.screen = context; this.isScreenSetup = true;
            this.cnv = canvas;
        }
    }

    get canvas() {
        return this.screen;
    }

    /**
     * @param {CallableFunction} callback - GameLoop Callback: write your game logic here
     * @param {boolean} debugMode - Enable Debugging Mode
     * If renderer finished then callback 
     */
    gameLoop(callback, debugMode) {
        FSCanvasEngineRenderer
            .renderNextFrame()
            .then((resolve, reject) => {
                if (resolve) {
                    callback && callback();
                    this.gameLoop(callback, debugMode);
                }
            });
    }

    /**
     * 1) Step I. init GameState
     * @param {number} gravity - Gravity Speed
     * @param {number} maximumCounter - Counter's maximum value (default 8)
     * @param {8 | 16 | 33 | 64 | 128 | 256} itemSize - Block size of your game (default 16)
     */
    initGameState(gravity = 0, itemSize = 16, maximumCounter = 8) {
        if (!this.gameState) {
            this.gameState = {
                animationFrame: {
                    counter: 0,
                    max: maximumCounter
                },
                itemSize: itemSize,
                variables: {},
                layers: [],
                gravity: {
                    speed: gravity,
                    enabled: (gravity > 0)
                },
                players: [],
                assetStore: {
                    blocks: [],
                    sprites: [], /* TODO: figure out this */
                    animations: []
                }
            }
        }
    }

    displayErrorMessage() {
        document
            .getElementById('alerts-wrapper')
            .insertAdjacentHTML('beforeend',`
                <div class="alert-box error">
                <h2 class="alert-title">Error</h2>
                <p class="alert-text">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente at praesentium architecto
                    commodi illum nobis, qui ducimus, eaque quis porro necessitatibus molestiae voluptatum sunt. Hic blanditiis
                    repellat ipsa sit accusamus.
                </p>
                </div>
            `)
    }

}
