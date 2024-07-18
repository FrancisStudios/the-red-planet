/**
 * This class is the main facade of the whole engine.
 * All application (and game) state is stored here and
 * processed in other classes and methods.
 */
import EngineConfig from '../config/engine.config.json' with {type: 'json'};
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
     * @param {8 | 16 | 32 | 64 | 128 | 256} itemSize - Block size of your game (default 16)
     * @param {number} maximumCounter - Counter's maximum value (default 8) it sets the maximum frames for all animations
     */
    initGameState(itemSize = 16, maximumCounter = 8) {
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
                players: [],
                assetStore: {
                    textures: [],
                    blocks: [],
                    sprites: [],
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
     * Build a Block from a loaded image asset or multiple assets
     * @param {string} id - Unique name for your block which you will refer to at map building
     * @param {Texture} texture - Static image or first frame of your animation
     * @param {{ x: 0, y: 0 }} position - Position in grid coordinates
     * @param {Array<Behavior>} physics - (Optional) List of Behaviors - use behavior constructor to build one.
     * @param {{ isAnimated: false, animationFrames: [] }} animation - (Optional) All animation frames as images
     */
    buildBlock(
        id,
        texture,
        position = { x: 0, y: 0 },
        physics = [{ type: 'visibility', enabled: true }],
        animation = { isAnimated: false, animationFrames: [] }
    ) {
        let errors = [];
        if (!this.gameState) { this.displayErrorMessage('Error', 'Game state has to be initialized before building a block!'); errors.push('init'); }
        if (!texture) { this.displayErrorMessage('Error', 'Not valid texture at buildBlock()!'); errors.push('texture'); } // TODO: check if texture is a proper texture
        if (this.gameState.assetStore.blocks.filter(b => b.id === id).length !== 0) { this.displayErrorMessage('Error', 'This block ID already exists!'); errors.push('blockid-match'); }

        if (errors.length === 0) {
            this.gameState.assetStore.blocks.push(
                {
                    id: id,
                    texture: texture,
                    position: position,
                    physics: physics,
                    animation: animation
                }
            );
        }
    }

    /**
     * Remove Block From Store
     * @param {string} id 
     */
    removeBlock(id) {
        if (this.gameState.assetStore.blocks) {
            this.gameState.assetStore.blocks = this.gameState.assetStore.blocks.filter(block => block.id !== id);
        } else this.displayErrorMessage('Error', 'Block store is not initialized!');
    }

    buildSprite() { /* TODO */ }

    /**
     * Remove Sprite From Store
     * @param {string} id 
     */
    removeSprite(id) {
        if (this.gameState.assetStore.sprites) {
            this.gameState.assetStore.sprites = this.gameState.assetStore.sprites.filter(sprite => sprite.id !== id);
        } else this.displayErrorMessage('Error', 'Sprite store is not initialized!');
    }

    /**
     * Create Texture
     * @param {string} url - Resource identifier (path to your image)
     * @param {string} id - Unique ID for your texture
     * @returns { Texture | false }
     */
    buildTexture(url, id) {
        if (this.gameState) {
            if (this.gameState.assetStore.textures.filter(t => t.id === id).length === 0) {
                const MediaImage = new Image(this.gameState.itemSize, this.gameState.itemSize);
                MediaImage.src = `${EngineConfig.paths.defaultImageLibrary}${url}`;
                let ERRORS = []

                MediaImage.onerror = () => {
                    ERRORS.push('load-error');
                    this.displayErrorMessage('Error', 'Could not load image texture!');
                }

                if (ERRORS.length === 0) {
                    const Texture = {
                        id: id,
                        image: MediaImage
                    }

                    this.gameState.assetStore.textures.push(Texture);
                    return Texture;
                } else {
                    return false;
                }

            } else this.displayErrorMessage('Error', 'Texture with this identifier, already exists!');
        } else this.displayErrorMessage('Error', 'Game state is not initialized! Make sure that game state is set before building textures!');
    }

    /**
     * Remove Texture From Store
     * @param {string} id 
     */
    removeTexture(id) {
        if (this.gameState.assetStore.textures) {
            this.gameState.assetStore.textures = this.gameState.assetStore.textures.filter(texture => texture.id !== id);
        } else this.displayErrorMessage('Error', 'Texture store is not initialized!');
    }
}
