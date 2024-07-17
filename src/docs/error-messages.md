# List of possible Error Messages

This will help you decypher and fix all possible error messages. 

**NOTE:** you have to enable `debugMode` to be able to see the error messages.

| Message | Cause(s) |
| ------- | ------ |
| Game state is already initialized! | You have already called `FSCanvasEngine.initGameState()` game state can only be initialized once. Please make sure that this method is referenced only once. |
| Game state is not yet initialized when trying to build a block. | You have to instantiate `FSCanvasEngine` (`FSCanvasEngine.getInstance()`) and call `FSCanvasEngine.initGameState()` before trying to build a block | 
| The screen is already set up! | The screen is already initialized once, it can not be initialized twice.|
| Game state has to be initialized before building a block! | The game state is not initialized yet. Please follow the initialization steps [javascript-api](./javascript%20API/javascript-api.md)|
| Not valid texture at buildBlock() | Texture must be a FSCE Texture - use texture builder to convert your image or tilemap to FSCE Textures. Consult [all-methods.md](./javascript%20API/all-methods.md) for texture builder and converter methods.|
| This block ID already exists! | The block ID is already occupied in `gameState.assetStore.blocks[]` please remove or try with a different name! **IMPORTANT: block names (IDs) meant to be unique**|