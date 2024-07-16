# List of possible Error Messages

This will help you decypher and fix all possible error messages. 

**NOTE:** you have to enable `debugMode` to be able to see the error messages.

| Message | Cause(s) |
| ------- | ------ |
| Game state is already initialized! | You have already called `FSCanvasEngine.initGameState()` game state can only be initialized once. Please make sure that this method is referenced only once. |
| Game state is not yet initialized when trying to load image.| You have to instantiate `FSCanvasEngine` (`FSCanvasEngine.getInstance()`) and call `FSCanvasEngine.initGameState()` before trying to load an image | 