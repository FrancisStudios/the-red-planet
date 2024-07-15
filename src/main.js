class FSCanvasEngine {
    screen;
    cnv;
    isScreenSetup

    instance;
    constructor() {
        if (this.instance) return this.instance
        else return new FSCanvasEngine();
    }

    /**
     * @param {string} id
     * @param {number} height
     * @param {number} width
     */
    setupScreen(id, height, width) {
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