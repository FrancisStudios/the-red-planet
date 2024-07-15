export default class FSCanvasEngine {
    screen;
    cnv;
    isScreenSetup

    instance;

    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new FSCanvasEngine();

        return this.instance;
    }

    /**
     * @param {string} id
     * @param {number} height
     * @param {number} width
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

}