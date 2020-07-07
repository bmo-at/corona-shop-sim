import { CoronaShopSimScene } from "../typings/scene";

export default function Inspector(x: number, y: number, scene: CoronaShopSimScene) {
    scene.initialInspectorFlag = false
    let state: inspector_state = {
        strikes: 0,
        stopped: false,
        meta: {},
        waypoints: [
            scene.checkPoints.FarmUpstate,
            scene.checkPoints.Entrance,
            scene.checkPoints.Hallway,
            scene.checkPoints.Register,
            scene.checkPoints.Hallway,
            scene.checkPoints.Hallway2,
            scene.checkPoints.Dairy,
            scene.checkPoints.Sweets,
            scene.checkPoints.Hallway2,
            scene.checkPoints.Hallway

        ],
        currentWaypoint: scene.checkPoints.Entrance
    }



    let inspector: Inspector = {
        sprite: scene.physics.add.sprite(x, y, "inspector_sprite")
            .setInteractive()
            .on("pointerdown", (pointer: Phaser.Input.Pointer) => {
                const pointerLocation = scene.input.activePointer.positionToCamera(scene.cameras.main) as Phaser.Math.Vector2;
            })
            .setDepth(2),
        state,
        destroy,
        update,
        destroyed: false,
        scene
    }
    return inspector
}

function update() {

    const inspector = this as Inspector

    if (!inspector.destroyed) {

        let npcs_in_store = []

        for (const npc in inspector.scene.npcs) {
            if (inspector.scene.npcs.hasOwnProperty(npc)) {
                const x = inspector.scene.npcs[npc];
                if (inspector.scene.store.rectangle.contains(x.sprite.x, x.sprite.y)) {
                    npcs_in_store.push(x)
                }
            }
        }

        if (npcs_in_store.length > 2 && inspector.scene.store.rectangle.contains(inspector.sprite.x, inspector.sprite.y)) {
            inspector.state.strikes++
        }

        if (inspector.state.strikes > 2) {
            inspector.scene.gameover()
        }

        const speed = 40;

        let body = inspector.sprite.body as Phaser.Physics.Arcade.Body

        let waypoint = (inspector.state.currentWaypoint as any) as { x: number, y: number, name: string }

        // Stop any previous movement from the last frame
        body.setVelocity(0);

        if (inspector.state.meta.waitUntil) {
            while (inspector.state.meta.waitUntil > inspector.scene.gameLoop.totalPlayTime) { return }
        }

        if (waypoint && (inspector.sprite.x !== waypoint.x || inspector.sprite.y !== waypoint.y)) {
            if (waypoint.y <= inspector.sprite.y) {
                body.setVelocityY(-speed)
            } else {
                body.setVelocityY(speed)
            }

            if (waypoint.x <= inspector.sprite.x) {
                body.setVelocityX(-speed)
            } else {
                body.setVelocityX(speed)
            }

        }

        if (waypoint && Math.abs(inspector.sprite.x - waypoint.x) < 8 && Math.abs(inspector.sprite.y - waypoint.y) < 8) {
            inspector.state.meta.waitUntil = inspector.scene.gameLoop.totalPlayTime + 2_000
            inspector.state.currentWaypoint = inspector.state.waypoints.pop()
        }

        if (inspector.state.currentWaypoint === undefined) {
            inspector.destroy()
        }

        body.velocity.normalize().scale(speed);

        if (inspector.state.stopped) { body.setVelocity(0) }
    }
}

function destroy() {
    let inspector = this as Inspector
    inspector.destroyed = true
    inspector.scene.gameLoop.timeSinceLastInspection = 0
    inspector.sprite.destroy()
}

export interface Inspector {
    scene: CoronaShopSimScene
    state: inspector_state
    sprite: Phaser.GameObjects.Sprite
    destroyed: boolean
    update?: Function
    move?: Function
    destroy?: Function
}

interface inspector_state {
    stopped: boolean
    strikes: number
    waypoints?: Phaser.GameObjects.GameObject[]
    currentWaypoint?: Phaser.GameObjects.GameObject
    meta?: { [key: string]: any }
}