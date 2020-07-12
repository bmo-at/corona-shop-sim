import { randomIntFromInterval, randomEnum } from "../util/helperMethods";
import { CoronaShopSimScene, } from "../typings/scene";
import { Tools } from "../typings/tools";
import { Articles } from "../typings/articles";

export default class NPC extends Phaser.GameObjects.GameObject {

    declare scene: CoronaShopSimScene
    declare sprite: Phaser.GameObjects.Sprite
    declare npc_state: NPCState
    destroyed: boolean = false

    constructor(x: number, y: number, scene: CoronaShopSimScene) {
        super(scene, 'npc')

        this.npc_state = new NPCState(this.scene)

        this.sprite = this.initializeSprite(x, y, this)

        if (this.npc_state.wearingMask) {
            this.sprite.play("idle_npc_mask")
        } else {
            this.sprite.play("idle_npc")
        }

        for (const name in this.scene.mapLayers) {
            if (this.scene.mapLayers.hasOwnProperty(name)) {
                const layer = this.scene.mapLayers[name];
                this.scene.physics.add.collider(this.sprite, layer)
            }
        }
    }

    update() {
        const npc = this

        let body = npc.sprite.body as Phaser.Physics.Arcade.Body

        if (
            npc.npc_state.stopped ||
            (npc.npc_state.meta.waitUntil && npc.npc_state.meta.waitUntil > npc.scene.gameLoop.totalPlayTime) ||
            (npc.npc_state.meta.waitForCashierUntil && npc.npc_state.meta.waitForCashierUntil > npc.scene.gameLoop.totalPlayTime) ||
            (npc.npc_state.meta.waitForRefillUntil && npc.npc_state.meta.waitForRefillUntil > npc.scene.gameLoop.totalPlayTime)
        ) {
            body.setVelocity(0); return
        }

        const speed = 40;

        let waypoint = (npc.npc_state.currentWaypoint as any) as { x: number, y: number, name: string }

        // Stop any previous movement from the last frame
        body.setVelocity(0);

        if (waypoint && (npc.sprite.x !== waypoint.x || npc.sprite.y !== waypoint.y)) {
            if (waypoint.y <= npc.sprite.y) {
                body.setVelocityY(-speed)
            } else {
                body.setVelocityY(speed)
            }

            if (waypoint.x <= npc.sprite.x) {
                body.setVelocityX(-speed)
            } else {
                body.setVelocityX(speed)
            }

        }

        if (waypoint && Math.abs(npc.sprite.x - waypoint.x) < 8 && Math.abs(npc.sprite.y - waypoint.y) < 8) {
            if (Object.keys(Articles).some(x => x === waypoint.name)) {
                if (npc.scene.shelves[waypoint.name].quantity > 0) {
                    npc.npc_state.shoppingList.splice(npc.npc_state.shoppingList.indexOf(Articles[waypoint.name]))
                    npc.scene.shelves[waypoint.name].quantity--
                    if (npc.scene.shelves[waypoint.name].dirtyness <= 80) {
                        npc.scene.shelves[waypoint.name].dirtyness = npc.scene.shelves[waypoint.name].dirtyness + 20
                    }
                    npc.npc_state.shoppingBasket.push(Articles[waypoint.name])
                    npc.npc_state.currentWaypoint = npc.npc_state.waypoints.pop()
                    if (npc.npc_state.meta.waitForRefillUntil) {
                        delete npc.npc_state.meta.waitForRefillUntil
                    } else {
                        npc.npc_state.meta.waitUntil = npc.scene.gameLoop.totalPlayTime + 2_500
                    }
                } else if (!npc.npc_state.meta.waitForRefillUntil) {
                    // TODO: Show needed article
                    npc.npc_state.meta.waitForRefillUntil = npc.scene.gameLoop.totalPlayTime + 7_500
                } else if (npc.npc_state.meta.waitForRefillUntil < npc.scene.gameLoop.totalPlayTime) {
                    npc.npc_state.currentWaypoint = npc.npc_state.waypoints.pop()
                }
            } else if (waypoint.name === 'Register' && npc.npc_state.shoppingBasket.length > 0) {
                npc.npc_state.currentWaypoint = npc.npc_state.waypoints.pop()
                npc.npc_state.waitingInLine = true
                npc.npc_state.meta.waitForCashierUntil = npc.scene.gameLoop.totalPlayTime + 25_000
            } else {
                npc.npc_state.currentWaypoint = npc.npc_state.waypoints.pop()
            }
        }

        if (npc.npc_state.currentWaypoint === undefined) {
            npc.npc_state.shoppingList.forEach((unboughtArticle) => {
                console.log(`${unboughtArticle} couldn't be accquired`)
                npc.scene.gameLoop.customerHappiness--
            })
            if (!npc.npc_state.hasPayed) {
                npc.npc_state.shoppingBasket.forEach((unpayedArticle) => {
                    console.log(`${unpayedArticle} was returned`)
                    npc.scene.gameLoop.money--
                    if (npc.scene.gameLoop.customerHappiness > 0) {
                        npc.scene.gameLoop.customerHappiness--
                    }
                    npc.scene.shelves[unpayedArticle].quantity++
                })
                if (npc.npc_state.forcedOut) {
                    if (npc.scene.gameLoop.customerHappiness >= 10) {
                        npc.scene.gameLoop.customerHappiness -= 10
                    } else {
                        npc.scene.gameLoop.customerHappiness = 0
                    }
                }
            }
            npc.destroy()
        }

        body.velocity.normalize().scale(speed);
    }

    destroy() {
        let npc = this
        npc.destroyed = true
        npc.sprite.destroy()
    }

    private initializeSprite(x: number, y: number, npc: NPC): Phaser.GameObjects.Sprite {
        let sprite = npc.scene.physics.add.sprite(x, y, "npc_sprite")
            .setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
                const pointerLocation = npc.scene.input.activePointer.positionToCamera(npc.scene.cameras.main) as Phaser.Math.Vector2;
                if (pointer.leftButtonDown()) {
                    if (npc.scene.player.interactionRadius.circle.contains(pointerLocation.x, pointerLocation.y)) {
                        switch (npc.scene.currentTool) {
                            case Tools.STOP:
                                npc.npc_state.stopped = !npc.npc_state.stopped
                                break;
                            case Tools.CASH:
                                delete npc.npc_state.meta.waitForCashierUntil
                                if (!npc.npc_state.hasPayed && npc.npc_state.waitingInLine) {
                                    npc.npc_state.shoppingBasket.forEach((boughtArticle) => {
                                        console.log(`${boughtArticle} has been sold`)
                                        npc.scene.gameLoop.money += 10
                                        if (npc.scene.gameLoop.customerHappiness < 100) {
                                            npc.scene.gameLoop.customerHappiness++
                                        }
                                    })
                                    npc.npc_state.hasPayed = true
                                    npc.npc_state.waitingInLine = false
                                }
                                break;
                            case Tools.FORCEOUT:
                                if (npc.scene.store.rectangle.contains((npc.sprite.body as Phaser.Physics.Arcade.Body).x, (npc.sprite.body as Phaser.Physics.Arcade.Body).y)) {
                                    npc.npc_state.forcedOut = true
                                    npc.npc_state.waypoints = [
                                        npc.scene.checkPoints.FarmUpstate,
                                        npc.scene.checkPoints.Entrance
                                    ]
                                    npc.npc_state.currentWaypoint = npc.scene.checkPoints.Hallway
                                } else {
                                    console.log(`You can't force out customers that are not on the store`)
                                }
                                break;
                            case Tools.MASK:
                                npc.npc_state.wearingMask = true
                                npc.sprite.play("idle_npc_mask")
                                break;
                            default:
                                console.log(`This tool can't be used here!`)
                                break;
                        }
                    } else {
                        console.log("You left-clicked me, but I am out of your range!")
                    }
                }
                if (pointer.rightButtonDown()) {
                    if (npc.scene.player.interactionRadius.circle.contains(pointerLocation.x, pointerLocation.y)) {
                        switch (npc.scene.currentTool) {
                            default:
                                console.log(`This tool can't be used here!`)
                                break;
                        }
                    } else {
                        console.log("You righ-clicked me, but I am out of your range!")
                    }
                }
            })
            .on(Phaser.Input.Events.POINTER_OVER, () => {

            })
            .on(Phaser.Input.Events.POINTER_OUT, () => {

            })
            .setDepth(2)

        return sprite
    }
}

class NPCState {
    declare wearingMask: boolean

    declare patienceScore: number
    declare understandingScore: number

    declare shoppingList: Articles[]
    declare shoppingBasket: Articles[]

    declare waypoints: Phaser.GameObjects.GameObject[]
    declare currentWaypoint: Phaser.GameObjects.GameObject

    declare waitingInLine: boolean
    declare hasPayed: boolean
    declare forcedOut: boolean

    declare stopped: boolean

    declare meta: { [key: string]: any }

    constructor(scene: CoronaShopSimScene) {
        this.wearingMask = Boolean(randomIntFromInterval(0, 1))

        this.patienceScore = randomIntFromInterval(1, 10) / 10
        this.understandingScore = randomIntFromInterval(1, 10) / 10

        this.shoppingList = this.generateShoppingList()
        this.shoppingBasket = []

        this.waypoints = [
            scene.checkPoints.FarmUpstate,
            scene.checkPoints.Entrance,
            scene.checkPoints.Hallway,
            scene.checkPoints.Register,
            scene.checkPoints.Hallway
        ]
        this.currentWaypoint = scene.checkPoints.Entrance

        this.populateWaypointsFromShoppingList(scene)

        this.waitingInLine = false
        this.hasPayed = false
        this.forcedOut = false

        this.stopped = false

        this.meta = {}
    }

    private generateShoppingList(): Articles[] {
        let amountOfArticles = randomIntFromInterval(1, 10)
        let shoppingList: Articles[] = []

        for (let article = 0; article < amountOfArticles; article++) {
            shoppingList.push(randomEnum(Articles))
        }
        return shoppingList
    }

    private populateWaypointsFromShoppingList(scene: CoronaShopSimScene) {
        this.shoppingList.forEach(item => {
            this.waypoints.push(scene.checkPoints[item])
            if (['Bread', 'Dairy', 'Sweets', 'Cereal', 'Hygiene'].find(x => x === item)) {
                this.waypoints.push(scene.checkPoints.Hallway2)
            } else {
                this.waypoints.push(scene.checkPoints.Hallway)
            }
        })
        this.waypoints.push(scene.checkPoints.Hallway)
    }
}