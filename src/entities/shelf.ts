import { CoronaShopSimScene, tools } from "../typings/scene";
import { Articles } from "../entities/npc";
import { Tilemaps } from "phaser";
import gameLoop from "./gameLoop";

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

    let shelf: Shelf = {
        location: { x: (checkPoint as any).x, y: (checkPoint as any).y },
        product: Article_Resolution.indexOf((checkPoint as any).name),
        quantity: initialQuantity,
        dirtyness: 0,
        tiles,
        dirtySprites: [],
        touchSprites: []
    }

    shelf.tiles.forEach(tile => {
        shelf.touchSprites.push(scene.physics.add.sprite(tile.pixelX, tile.pixelY, "atlas", -1)
            .setInteractive()
            .on("pointerdown", (pointer: Phaser.Input.Pointer) => {
                const pointerLocation = scene.input.activePointer.positionToCamera(scene.cameras.main) as Phaser.Math.Vector2;
                switch (scene.currentTool) {
                    case tools.REFILL:
                        if (pointer.leftButtonDown) {
                            if (scene.gameLoop.money >= 30) {
                                shelf.quantity += 10
                                scene.gameLoop.money -= 30
                            }
                            else {
                                console.log(`You only have ${scene.gameLoop.money}, sell some more to refill!`)
                            }
                        }
                        else {
                            console.log(`This shelf has ${shelf.quantity} units of ${Article_Resolution[shelf.product]} left`)
                        }
                        break;
                    case tools.DISINFECT:
                        if (pointer.leftButtonDown) {
                            shelf.dirtyness = 0
                        }
                        else {
                            console.log(`This shelf is ${shelf.dirtyness}% dirty`)
                        }
                        break;
                    default:
                        console.log("This can't be used here, try another tool!")
                        break;
                }
            })
            .on('pointerover', () => {
                console.log('TETS')
            })
        )
    });

    switch (Article_Resolution[shelf.product]) {
        case "Hygiene":
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(7) + 16,
                scene.map.tileToWorldY(18) + 16,
                'shelves_top_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(7) + 16,
                scene.map.tileToWorldY(19) + 16,
                'shelves_top_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(7) + 16,
                scene.map.tileToWorldY(20) + 16,
                'shelves_top_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            break;
        case "Cereal":
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(7) + 16,
                scene.map.tileToWorldY(15) + 16,
                'shelves_top_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(7) + 16,
                scene.map.tileToWorldY(16) + 16,
                'shelves_top_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(7) + 16,
                scene.map.tileToWorldY(27) + 16,
                'shelves_top_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            break;
        case "Bread":
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(8) + 16,
                scene.map.tileToWorldY(5) + 16,
                'shelves_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(8) + 16,
                scene.map.tileToWorldY(6) + 16,
                'shelves_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(9) + 16,
                scene.map.tileToWorldY(5) + 16,
                'shelves_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(9) + 16,
                scene.map.tileToWorldY(6) + 16,
                'shelves_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(8) + 16,
                scene.map.tileToWorldY(7) + 16,
                'shelves_bottom_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(9) + 16,
                scene.map.tileToWorldY(7) + 16,
                'shelves_bottom_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            break;
        case "Meat":
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(11) + 16,
                scene.map.tileToWorldY(5) + 16,
                'shelves_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(11) + 16,
                scene.map.tileToWorldY(6) + 16,
                'shelves_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(12) + 16,
                scene.map.tileToWorldY(5) + 16,
                'shelves_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(12) + 16,
                scene.map.tileToWorldY(6) + 16,
                'shelves_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(11) + 16,
                scene.map.tileToWorldY(7) + 16,
                'shelves_bottom_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(12) + 16,
                scene.map.tileToWorldY(7) + 16,
                'shelves_bottom_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            break;
        case "Drinks":
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(12) + 16,
                scene.map.tileToWorldY(18) + 16,
                'shelves_top_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(12) + 16,
                scene.map.tileToWorldY(19) + 16,
                'shelves_top_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(12) + 16,
                scene.map.tileToWorldY(20) + 16,
                'shelves_top_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            break;
        case "Produce":
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(15) + 16,
                scene.map.tileToWorldY(16) + 16,
                'basket_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(15) + 16,
                scene.map.tileToWorldY(17) + 16,
                'basket_bottom_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(15) + 16,
                scene.map.tileToWorldY(15) + 16,
                'basket_top_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            break;
        case "Fish":
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(10) + 16,
                scene.map.tileToWorldY(9) + 16,
                'basket_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(10) + 16,
                scene.map.tileToWorldY(10) + 16,
                'basket_bottom_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(10) + 16,
                scene.map.tileToWorldY(8) + 16,
                'basket_top_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            break;
        case "Dairy":
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(7) + 16,
                scene.map.tileToWorldY(8) + 16,
                'shelves_top_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(7) + 16,
                scene.map.tileToWorldY(9) + 16,
                'shelves_top_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(7) + 16,
                scene.map.tileToWorldY(10) + 16,
                'shelves_top_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            break;
        case "Sweets":
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(11) + 16,
                scene.map.tileToWorldY(15) + 16,
                'shelves_top_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(11) + 16,
                scene.map.tileToWorldY(16) + 16,
                'shelves_top_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            shelf.dirtySprites.push(scene.physics.add.sprite(
                scene.map.tileToWorldX(11) + 16,
                scene.map.tileToWorldY(17) + 16,
                'shelves_top_dirt')
                .setAlpha(0)
                .setDepth(4)
            )
            break;
    }

    return shelf
}

export interface Shelf {
    location: { x: number, y: number }
    product: Articles
    quantity: number
    dirtyness: number
    tiles?: Phaser.Tilemaps.Tile[]
    dirtySprites: Phaser.GameObjects.Sprite[]
    touchSprites: Phaser.GameObjects.Sprite[]
}