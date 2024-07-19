import FSCanvasEngineErrorLogger from "./error-logger.js";

export default class FSCanvasEngineControllers {
    static attachGameControllers(gameState) {
        if (gameState.actions) {
            document.addEventListener('keyup', (event) => {
                const action = {
                    type: 'keypress',
                    value: event.code
                }
                gameState.actions.push(action);
            });
        } else FSCanvasEngineErrorLogger.displayErrorMessage('Error', 'Actions is not initialized to attach controllers!')
    }
}