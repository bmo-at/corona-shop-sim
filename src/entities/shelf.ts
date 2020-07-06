import { CoronaShopSimScene } from "../typings/scene";
import { Articles } from "../entities/npc";
import { Tilemaps } from "phaser";

const Article_Resolution = [
    "Hygiene",
    "Cereal",
    "Bread",
    "Meat",
    "Drinks",
    "Produce",
    "Fish",
    "Dairy",
    "Sweets"
]

export default function Shelf(checkPoint: Phaser.GameObjects.GameObject, scene: CoronaShopSimScene, initialQuantity: number, tiles: Tilemaps.Tile[]) {

    let shelf = {
        location: { x: (checkPoint as any).x, y: (checkPoint as any).y },
        product: Article_Resolution.indexOf((checkPoint as any).name),
        quantity: initialQuantity,
        cleanliness: 100,
        tiles
    } as Shelf

    shelf.tiles.forEach(tile => {
        scene.physics.add.sprite(tile.pixelX, tile.pixelY, "atlas", 62)
            .setInteractive()
            .on("pointerdown", (pointer: Phaser.Input.Pointer) => {
                const pointerLocation = scene.input.activePointer.positionToCamera(scene.cameras.main) as Phaser.Math.Vector2;
                if (pointer.leftButtonDown()) {
                    if (scene.player.interactionRadius.circle.contains(pointerLocation.x, pointerLocation.y)) {
                        console.log(`Shelf refilled with ${initialQuantity} of ${Article_Resolution[shelf.product]}`)
                        shelf.quantity = 10
                    } else {
                        console.log(`You clicked the shelf containing ${Article_Resolution[shelf.product]}, but it is out of your range!`)
                    }
                }
                if (pointer.rightButtonDown()) {
                    console.log(`There's ${shelf.quantity} of ${Article_Resolution[shelf.product]} remaining`)
                }
            })

    });

    return shelf
}

export interface Shelf {
    location: { x: number, y: number }
    product: Articles
    quantity: number
    cleanliness: number
    tiles?: Phaser.Tilemaps.Tile[]
}