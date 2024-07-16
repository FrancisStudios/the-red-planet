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

            /* With Game State We Init All HTML Stuff */
            document.addEventListener('DOMContentLoaded', () => {

                /* Remove Error From SCR */
                document
                    .querySelector('.close-error')
                    .addEventListener('click',
                        (e) => {
                            document.getElementById(e.target.id.split('-')[0]).remove();
                        }
                    );
            });

            this.displayErrorMessage('Error', 'Test flédslfé sdélf dséalf')
        }

    }

    /**
     * Display an Error Message
     * @param {string} title - Usually Error
     * @param {string} text  - Description of issue
     */
    displayErrorMessage(title, text) {
        const id = this.generateId(64);

        document
            .getElementById('alerts-wrapper')
            .insertAdjacentHTML('beforeend', `
                <div class="alert-box error" id="${id}">
                <h2 class="alert-title">
                    ${title} 
                    <input type="button" class="close-error" value="x" id="${id}-button"/>
                </h2>
                <p class="alert-text">
                   ${text}
                </p>
                </div>
            `)
    }

    /**
     * Generates a random id string
     * @param {number} length 
     * @returns {string}
     */
    generateId(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length; let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

}
