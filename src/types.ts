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
    players: Array<Player>,
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
    Blocks: Array<Block> /* Multiple Blocks can be in a sprite */
}

export type Coordinates = {
    x: number,
    y: number
}

export type Player = {
    name: string /* Unique identifier */
    sprite: Sprite
    isControlEnabled: boolean, /* Enable / Disable Controls */
    layer: number /* z-index where player is on */
}

export type Behavior = {
    type: 'force-field' | 'collision-box' | 'controller' | 'visibility',
    enabled: boolean,
    direction: 'x+' | 'x-' | 'y+' | 'y-',
    force: number;
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