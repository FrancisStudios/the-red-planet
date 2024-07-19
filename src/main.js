/**
 * This class is the main facade of the whole engine.
 * All application (and game) state is stored here and
 * processed in other classes and methods.
 */
import EngineConfig from '../config/engine.config.json' with {type: 'json'};
import FSCanvasEngineRenderer from "./renderer/renderer.js";
import FSCanvasEngineControllers from './services/controllers.js';
import FSCanvasEngineErrorLogger from './services/error-logger.js';
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
        } else FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'The screen is already set up!');
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
                variables: [],
                layers: [],
                actions: [],
                assetStore: {
                    textures: [],
                    blocks: [],
                    sprites: [],
                    animations: []
                }
            }
        } else FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Game state is already initialized!');
    }

    enableDebugMode() {
        if (document.getElementById('alerts-wrapper').hidden) document.getElementById('alerts-wrapper').hidden = false;
    }

    disableDebugMode() {
        if (!document.getElementById('alerts-wrapper').hidden) document.getElementById('alerts-wrapper').hidden = true;
    }

    /**
     * Build a Block from a loaded image asset or multiple assets
     * @typedef {import('./types.ts').Behavior} Behavior
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
        if (!this.gameState) { FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Game state has to be initialized before building a block!'); errors.push('init'); }
        if (!texture) { FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Not valid texture at buildBlock()!'); errors.push('texture'); } // TODO: check if texture is a proper texture
        if (this.gameState?.assetStore?.blocks?.filter(b => b.id === id).length !== 0) { FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'This block ID already exists!'); errors.push('blockid-match'); }

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
        if (this.gameState?.assetStore?.blocks) {
            this.gameState.assetStore.blocks = this.gameState.assetStore.blocks.filter(block => block.id !== id);
        } else FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Block store is not initialized!');
    }

    /**
     * Returns a block
     * @param {string} id 
     * @returns {import('./types.ts').Block}
     */
    getBlock(id) {
        if (this.gameState?.assetStore?.blocks?.length > 0) {
            return this.gameState.assetStore.blocks.filter(b => b.id === id)[0] ?? [];
        } else FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Block store is not ready!');
    }

    buildSprite() { /* TODO */ }

    /**
     * Remove Sprite From Store
     * @param {string} id 
     */
    removeSprite(id) {
        if (this.gameState?.assetStore?.sprites) {
            this.gameState.assetStore.sprites = this.gameState.assetStore.sprites.filter(sprite => sprite.id !== id);
        } else FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Sprite store is not initialized!');
    }

    /**
     * Create Texture
     * @typedef {import('./types.ts').Texture} Texture
     * @param {string} url - Resource identifier (path to your image)
     * @param {string} id - Unique ID for your texture
     * @returns { Texture | false }
     */
    buildTexture(url, id) {
        if (this.gameState) {
            if (this.gameState?.assetStore?.textures?.filter(t => t.id === id).length === 0) {
                const MediaImage = new Image(this.gameState.itemSize, this.gameState.itemSize);
                MediaImage.src = `${EngineConfig.paths.defaultImageLibrary}${url}`;
                let ERRORS = []

                MediaImage.onerror = () => {
                    ERRORS.push('load-error');
                    FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Could not load image texture!');
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

            } else FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Texture with this identifier, already exists!');
        } else FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Game state is not initialized! Make sure that game state is set before building textures!');
    }

    /**
     * Returns a texture from store
     * @param {string} id 
     * @returns {Texture}
     */
    getTexture(id) {
        if (this.gameState?.assetStore?.textures) {
            return this.gameState.assetStore.textures.filter(texture => texture.id === id)[0];
        } else FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Texture store is not ready!');
    }

    /**
     * Remove Texture From Store
     * @param {string} id 
     */
    removeTexture(id) {
        if (this.gameState?.assetStore?.textures) {
            this.gameState.assetStore.textures = this.gameState.assetStore.textures.filter(texture => texture.id !== id);
        } else FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Texture store is not initialized!');
    }

    /**
     * Create a layer
     * @param {string} name - Unique layer name
     * @param {number} index - [Optional] Layer Z-index (lower numbers in the back - higher numbers in the front)
     * @returns {Layer | False}
     */
    createLayer(name, index = false) {
        if (this.gameState?.layers) {
            let ERRORS = [];
            if (this.gameState.layers.filter(layer => layer.name === name).length !== 0) { ERRORS.push('name conflict'); FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Layer name already exists!'); }
            if (ERRORS.length === 0) {
                const Layer = {
                    index: index ? index : this.gameState.layers.length,
                    name: name,
                    items: []
                }
                this.gameState.layers.push(Layer)
            } else return false;
        } else FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Gamestate is not initialized for layer operations!')
    }

    /**
     * Remove a layer by it's name
     * @param {string} name 
     */
    removeLayer(name) {
        if (this.gameState?.layers) {
            this.gameState.layers = this.gameState.layers.filter(layer => layer.name !== name);
        } else FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Gamestate is not initialized for layer operations!');
    }

    /**
     * Returns all layers
     * @typedef {import('./types.ts').Layer} Layer
     * @returns {Array<Layer>}
     */
    listLayer() {
        if (this.gameState?.layers) {
            return this.gameState.layers
        } else FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Gamestate is not initialized for layer operations!');
    }

    /**
     * @typedef {import('./types.ts').GameStateType} GameStateType
     * @returns {GameStateType}
     */
    getGameState() {
        {
            if (this.gameState) {
                return this.gameState
            } else FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Gamestate is not initialized!');
        }
    }

    /**
     * @typedef {import('./types.ts').Item} Item
     * @param {Item} item 
     * @param {string} layerName
     */
    insertToLayer(item, layerName) {
        if (this.gameState?.layers?.length > 0) {
            this.gameState.layers.forEach(layer => {
                if (layer.name === layerName) {
                    layer.items.push(item);
                }
            });
        } else FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Layers are not initialized or no layer present!');
    }

    /**
     * Remove item from layer
     * @param {Item} item 
     * @param {string} layerName 
     */
    removeFromLayer(item, layerName) {
        if (this.gameState.layers.length > 0) {

        } else FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Layers are not initialized or no layer present!');
    }

    attachGameController(item = 'nl') {
        FSCanvasEngineControllers.attachGameControllers(this.gameState);
    }
}
