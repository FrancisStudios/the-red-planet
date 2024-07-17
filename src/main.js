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
    resolution = { width: 0, height: 0 }
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
            this.resolution.width = width; this.resolution.height = height;
            this.screen = context; this.isScreenSetup = true;
            this.cnv = canvas;
        } else this.displayErrorMessage('Error', 'The screen is already set up!');
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

        debugMode
            ? this.enableDebugMode()
            : this.disableDebugMode();

        const renderData = {
            gameState: this.gameState,
            debugMode: debugMode
        };

        FSCanvasEngineRenderer
            .renderNextFrame(renderData)
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
                canvas: this.screen,
                resolution: this.resolution,
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
        } else this.displayErrorMessage('Error', 'Game state is already initialized!');
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
            `);

        /* Remove Error From SCR */
        document.addEventListener('DOMContentLoaded', () => {
            document
                .querySelectorAll('.close-error')
                .forEach(el => {
                    el.addEventListener('click',
                        (e) => {
                            if (document.getElementById(e.target.id.split('-')[0]) && e.target.id.split('-')[1] === 'button') {
                                document.getElementById(e.target.id.split('-')[0]).remove();
                            }
                        }
                    );
                })

        });
    }

    enableDebugMode() {
        if (document.getElementById('alerts-wrapper').hidden) document.getElementById('alerts-wrapper').hidden = false;
    }

    disableDebugMode() {
        if (!document.getElementById('alerts-wrapper').hidden) document.getElementById('alerts-wrapper').hidden = true;
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

    /**
     * 
     * @param {URL} texture - Path to texture 
     * @param {string} name - Unique name for block type
     * @param {*} position - coordinates { x: column, y: row }
     * @param {*} physics - { isVisible: boolean, isGravityEnabled: boolean, isCollisionEnabled: boolean }
     * @returns
     */
    blockBuilder(texture, name, position = { x: 0, y: 0 }, physics = { isVisible: true, isGravityEnabled: false, isCollisionEnabled: true }) {
        if (this.gameState) {
            //let image = new Image();
            //img.src = `../game/assets/img/${imgName}`;
        } else this.displayErrorMessage('Error', 'Game state is not yet initialized when trying to build a block.');
    }
}
