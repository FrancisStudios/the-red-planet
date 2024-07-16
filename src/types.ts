export type GameStateType = {
    animationFrame: {
        counter: number,
        max: number /* User defines how long the counter goes when setting up an animation */
    },
    itemSize: 8 | 16 | 32 | 64 | 128 | 256, /* Items should be 8x8 or 16x16... */
    variables: Array<GameVariable>,
    layers: Array<Layer>,
    gravity: {
        speed: number /* A number that represents gravity speed (or direction) */
        enabled: boolean /* Enable / Disable gravity */
    },
    players: Array<Player>,
    assetStore: {
        blocks: Array<string>, /* TODO: figure all of this out*/
        sprites: Array<Sprite>,
        animations: Array<string[]>
    }
}

type GameVariable = {
    name: string,
    value: string | number | null
}

type Layer = {
    index: number, /* It's the layer height like z-index */
    name: string,
    sprites: Array<Sprite>
}

type Item = {
    texture: string, /* Texture to display  TODO: figure out how I will do animations it's an Array<Texture> with animationFrame.max length!*/ 
    position: Coordinates,
    physics: {
        isGravityEnabled: boolean,
        isCollisionEnabled: boolean
    }
}

type Sprite = {
    items: Array<Item> /* Multiple items can be in a sprite */
}

type Coordinates = {
    x: number,
    y: number
}

type Player = {
    name: string /* Unique identifier */
    sprite: Sprite
    isControlEnabled: boolean, /* Enable / Disable Controls */
    layer: number /* z-index where player is on */
}