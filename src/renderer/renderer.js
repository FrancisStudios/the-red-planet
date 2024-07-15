export default class FSCanvasEngineRenderer {
    static renderNextFrame() {
        return new Promise((resolve, reject) => {

            /* 
             Mock frame render 
             the main.js should be the facade, storing all the 
             application state (like what to render each frame)
             and here the heavy lifting [rendering logic] should
             dwell.
            */
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });
    }
}