import { randomIntFromInterval, randomEnum } from "../util/helperMethods";
import { CoronaShopSimScene } from "../typings/scene";

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

export default function NPC(x: number, y: number, scene: CoronaShopSimScene): NPC {

    let amountOfArticles = randomIntFromInterval(1, 10)
    let shoppingList: Articles[] = []

    for (let article = 0; article < amountOfArticles; article++) {
        shoppingList.push(randomEnum(Articles))
    }

    let state: npc_state = {
        patienceScore: randomIntFromInterval(0, 9),
        understandingScore: randomIntFromInterval(0, 9),
        wearingMask: Boolean(randomIntFromInterval(0, 1)),
        shoppingList,
        currentWaypoint: scene.checkPoints.Entrance, //Door
        waypoints: [
            scene.checkPoints.FarmUpstate,
            scene.checkPoints.Entrance,
            scene.checkPoints.Hallway,
            scene.checkPoints.Register,
            scene.checkPoints.Hallway
        ],
        stopped: false,
        meta: {}
    }

    shoppingList.forEach(item => {
        state.waypoints.push(scene.checkPoints[`${Article_Resolution[item]}`])
        if (['Bread', 'Dairy', 'Sweets', 'Cereal', 'Hygiene'].find(x => x === Article_Resolution[item])) {
            state.waypoints.push(scene.checkPoints.Hallway2)
        } else {
            state.waypoints.push(scene.checkPoints.Hallway)
        }
    })

    state.waypoints.push(scene.checkPoints.Hallway)

    console.log(state.waypoints)

    var npc: NPC = {
        sprite: scene.physics.add.sprite(x, y, "npc_sprite")
            .setInteractive()
            .on("pointerdown", (pointer: Phaser.Input.Pointer) => {
                const pointerLocation = scene.input.activePointer.positionToCamera(scene.cameras.main) as Phaser.Math.Vector2;
                if (pointer.leftButtonDown()) {
                    if (scene.player.interactionRadius.circle.contains(pointerLocation.x, pointerLocation.y)) {
                        console.log(`You clicked me! As you're already here, I'll tell you what I need (${state.shoppingList.length} items):`)
                        state.shoppingList.forEach(item => {
                            console.log(`${Article_Resolution[item]}`)
                        });

                        npc.state.stopped = !npc.state.stopped

                    } else {
                        console.log("You clicked me, but I am out of your range!")
                    }
                }
                if (pointer.rightButtonDown()) {
                    console.log("I will now wear a mask")
                    npc.state.wearingMask = true
                    npc.sprite.play("idle_npc_mask")
                }
            })
            .setDepth(2),
        state,
        scene,
        update,
        destroy,
        destroyed: false
    };

    if (npc.state.wearingMask) {
        npc.sprite.play("idle_npc_mask")
    } else {
        npc.sprite.play("idle_npc")
    }

    npc.scene.physics.add.collider(npc.sprite, npc.scene.mapLayers.foreground)
    npc.scene.physics.add.collider(npc.sprite, npc.scene.mapLayers.background)
    npc.scene.physics.add.collider(npc.sprite, npc.scene.mapLayers.midground)

    return npc;
}

function update() {

    const npc = this as NPC

    const speed = 40;

    let body = npc.sprite.body as Phaser.Physics.Arcade.Body

    let waypoint = (npc.state.currentWaypoint as any) as { x: number, y: number, name: string }

    // Stop any previous movement from the last frame
    body.setVelocity(0);

    if (npc.state.meta.waitUntil) {
        while (npc.state.meta.waitUntil > npc.scene.gameLoop.totalPlayTime) { return }
    }

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
        if (Article_Resolution.some(x => x === waypoint.name)) {
            npc.state.meta.waitUntil = npc.scene.gameLoop.totalPlayTime + 5_000
            npc.scene.shelves[waypoint.name].quantity--
        } else if (waypoint.name === "Register") {
            npc.state.meta.waitUntil = npc.scene.gameLoop.totalPlayTime + 5_000
        }
        npc.state.currentWaypoint = npc.state.waypoints.pop()
    }

    if (npc.state.currentWaypoint === undefined) {
        npc.destroy()
    }

    body.velocity.normalize().scale(speed);

    if (npc.state.stopped) { body.setVelocity(0) }
}

function destroy() {
    let npc = this as NPC
    npc.destroyed = true
    npc.sprite.destroy()
}

export interface NPC {
    scene: CoronaShopSimScene
    state: npc_state
    sprite: Phaser.GameObjects.Sprite
    destroyed: boolean
    update?: Function
    move?: Function
    destroy?: Function
}

export interface npc_state {
    wearingMask: boolean
    shoppingList: Articles[]
    patienceScore: number
    understandingScore: number
    stopped: boolean
    waypoints?: Phaser.GameObjects.GameObject[]
    currentWaypoint?: Phaser.GameObjects.GameObject
    meta?: { [key: string]: any }
}

export enum Articles {
    Hygiene,
    Cereal,
    Bread,
    Meat,
    Drinks,
    Produce,
    Fish,
    Dairy,
    Sweets
}