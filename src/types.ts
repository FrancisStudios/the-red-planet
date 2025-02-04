export type GameStateType = {
    canvas: CanvasRenderingContext2D,
    resolution: {
        width: number
        height: number
    }
    animationFrame: {
        counter: number,
        max: number /* User defines how long the counter goes when setting up an animation */
    },
    BlockSize: 8 | 16 | 32 | 64 | 128 | 256, /* Blocks should be 8x8 or 16x16... */
    variables: Array<GameVariable>,
    layers: Array<Layer>,
    actions: Array<Action>, /* Keypresses are put into actions automatically and queued and executed during render */
    assetStore: {
        textures: Array<Texture>
        blocks: Array<Block>, /* TODO: figure all of this out*/
        sprites: Array<Sprite>,
        animations: Array<Animation>
    }
}

export type GameVariable = {
    name: string,
    value: string | number | null
}

export type Layer = {
    index: number, /* It's the layer height like z-index */
    name: string,
    items: Array<Item>
}

export type Block = {
    id: string,
    texture: Texture,
    position: Coordinates,
    physics: Array<Behavior>,
    animation: {
        isAnimated: boolean, /* If disabled defaults to texture */
        animationFrames: Animation
    }
}

export type Sprite = {
    id: string,
    physics: Array<Behavior>,
    position: Coordinates, /* TODO: IDEA: what if we handle only one position */
    blocks: Array<Block> /* Multiple Blocks can be in a sprite */
}

export type Coordinates = {
    x: number,
    y: number
}

export type Behavior = {
    type: 'force-field' | 'collision-box' | 'controller' | 'visibility' | 'game-controller',
    enabled: boolean,
    direction?: 'x+' | 'x-' | 'y+' | 'y-', /* Not for game controller */
    force: number
}

export type Texture = {
    id: string,
    image: MediaImage
}

export type Animation = {
    id: string,
    frames: Array<Texture>
}

export type Item = Block | Sprite;

export type Action = {
    type: 'keypress' | 'variable-change',
    target?: string /* variable name or additional info */,
    value: string
}