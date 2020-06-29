import { randomIntFromInterval, randomEnum } from "../util/helperMethods";
import { CoronaShopSimScene } from "../typings/scene";

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
        currentWaypoint: { x: 800, y: 465 }, //Door
        waypoints: [],
        stopped: false
    }

    state.waypoints.push({ x: 800, y: 30 })
    state.waypoints.push({ x: 800, y: 465 })
    state.waypoints.push({ x: 650, y: 470 })
    state.waypoints.push({ x: 575, y: 320 })

    let amountOfWaypoints = randomIntFromInterval(5, 15)
    for (let waypoint = 0; waypoint < amountOfWaypoints; waypoint++) {
        state.waypoints.push({ x: randomIntFromInterval(400, 510), y: randomIntFromInterval(290, 420) })
    }

    state.waypoints.push({ x: 650, y: 470 })

    console.log(state.waypoints)

    var npc: NPC = {
        sprite: scene.physics.add.sprite(x, y, "npc_sprite")
            .setInteractive()
            .on("pointerdown", (pointer: Phaser.Input.Pointer) => {
                // const pointer = scene.input.activePointer.positionToCamera(scene.cameras.main) as Phaser.Math.Vector2;
                if (pointer.leftButtonDown()) {
                    const test = [
                        "Hygenie",
                        "Cereal",
                        "Bread",
                        "Meat",
                        "Drinks",
                        "Produce",
                        "Fish",
                        "Dairy",
                        "Sweets"
                    ]

                    if (true/*scene.player.interactionRadius.circle.contains(pointer.x, pointer.y)*/) {
                        console.log(`You clicked me! As you're already here, I'll tell you what I need (${state.shoppingList.length} items):`)
                        state.shoppingList.forEach(item => {
                            console.log(`${test[item]}`)
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

    // Stop any previous movement from the last frame
    body.setVelocity(0);

    if (npc.state.currentWaypoint && (npc.sprite.x !== npc.state.currentWaypoint.x || npc.sprite.y !== npc.state.currentWaypoint.y)) {
        if (npc.state.currentWaypoint.x < npc.sprite.x) {
            body.setVelocityX(-speed)
        } else {
            body.setVelocityX(speed)
        }

        if (npc.state.currentWaypoint.y < npc.sprite.y) {
            body.setVelocityY(-speed)
        } else {
            body.setVelocityY(speed)
        }
    }

    if (npc.state.currentWaypoint && Math.abs(npc.sprite.x - npc.state.currentWaypoint.x) < 16 && Math.abs(npc.sprite.y - npc.state.currentWaypoint.y) < 16) {
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
    waypoints?: { x: number, y: number }[]
    currentWaypoint?: { x: number, y: number }
}

enum Articles {
    Hygenie,
    Cereal,
    Bread,
    Meat,
    Drinks,
    Produce,
    Fish,
    Dairy,
    Sweets
}





    // enemy.state = 'patrol';
    // enemy.xDest = x;
    // enemy.yDest = y;
    // enemy.animations.add('wait', [544, 545], 4);
    // enemy.direction = 1;
    // enemy.frame = 544;
    // enemy.anchor.setTo(.5, 1);
    // enemy.scale.x = -1;

    // enemy.goToXY = function (x, y) {
    //     enemy.xDest = x;
    //     enemy.yDest = y;
    // }

    // npc.update = function () {
    //     console.log("Test")
    // }

    // enemy.stop = function () {
    //     var self = this;
    //     self.xDest = self.x;
    //     self.yDest = self.y;
    // }

    // enemy.patrol = function () {
    //     var self = this;
    //     if (Math.floor(self.x / 10) == Math.floor(self.xDest / 10)) {
    //         self.direction = self.direction * -1;
    //         self.goToXY(self.x + self.direction * 100);
    //     }
    // }