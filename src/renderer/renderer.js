export default class FSCanvasEngineRenderer {
    static renderNextFrame(renderData) {
        return new Promise((resolve, reject) => {
            let _renderProcesses = [];

            if (renderData) {
                if (renderData.debugMode) _renderProcesses.push(FSCanvasEngineRenderer.debugMode(renderData.gameState));

                const testLoad = () => {
                    return new Promise(rsv => {
                        setTimeout(() => {
                            rsv(true);
                        }, 100);
                    })
                }
                _renderProcesses.push(testLoad());
                _renderProcesses.push(this.renderLayers(renderData.gameState))
            } else resolve(false);

            Promise
                .all(_renderProcesses)
                .then((d) => { resolve(true) });
        });
    }

    static renderLayers(gameState) {
        return new Promise((resolve, reject) => {
            const indexes = gameState.layers.map(layer => layer.index).sort();
            const itemSize = gameState.itemSize;
            for (let zindex of indexes) {
                for (let item of gameState.layers[zindex].items) {
                    if ('blocks' in item) {
                        /* If it's a sprite then loop through blocks */
                        for (let buildingBlock of item.blocks) {
                            const isVisible = buildingBlock?.physics?.filter(behavior => behavior.type === 'visibility')[0]?.enabled;
                            if (isVisible) {
                                gameState.canvas.drawImage(
                                    buildingBlock.texture.image,
                                    (buildingBlock.position.x * itemSize) - itemSize,
                                    (buildingBlock.position.y * itemSize) - itemSize,
                                    itemSize,
                                    itemSize
                                );
                            }
                        }
                    } else {
                        /* If it's a block */
                        const isVisible = item?.physics?.filter(behavior => behavior.type === 'visibility')[0]?.enabled;
                        if (isVisible) {
                            gameState.canvas.drawImage(
                                item.texture.image,
                                (item.position.x * itemSize) - itemSize,
                                (item.position.y * itemSize) - itemSize,
                                itemSize,
                                itemSize
                            );
                        }
                    }


                }
            }

            resolve();
        });
    }

    static debugMode(gameState) {
        return new Promise((resolve, reject) => {
            if (gameState) {
                const blockSize = gameState.itemSize;
                const canvas = gameState.canvas;

                /* Horizontal Test Bars */
                for (let lineX = 0; lineX <= gameState.resolution.width; lineX += blockSize) {
                    canvas.beginPath();
                    canvas.moveTo(lineX, 0);
                    canvas.lineTo(lineX, gameState.resolution.height);
                    canvas.stroke();
                }

                /* Vertical Test Bars */
                for (let lineY = 0; lineY <= gameState.resolution.height; lineY += blockSize) {
                    canvas.beginPath();
                    canvas.moveTo(0, lineY);
                    canvas.lineTo(gameState.resolution.width, lineY);
                    canvas.stroke();
                }

                canvas.fillStyle = 'red';
                canvas.font = '16px Arial';
                canvas.fillText(
                    `${gameState.resolution.width}x${gameState.resolution.height} @ ${blockSize}x${blockSize}`,
                    16,
                    16
                );
                canvas.fillStyle = 'black';
                resolve();

            } else reject();
        });
    }
}