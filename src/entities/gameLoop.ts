import NPC from "./npc";
import { CoronaShopSimScene } from "../typings/scene";
import { randomIntFromInterval } from "../util/helperMethods";
import Inspector from "./inspector";

/**
 * Day should last 5 minutes
 */
export const DAY_DURATION_SECONDS = 300

/**
 * @returns Game loop object with an update function and attributes to support time managment in engine
 * @property totalPlayTime: Milliseconds since game loop was started
 * @property day: Number of in game day
 * @property timeOfDay: Milliseconds in current day [Range: 0 - 300 000]
 * @property started: Unix timestamp of when game loop was started (Disregards initialPlayTime) 
 * @property paused 
 * @method update: Method to update the game loop
 * @param initialPlayTime Optional parameter to start a game loop with time already passed
 */
export default function gameLoop(scene: CoronaShopSimScene, initialPlayTime?: number): GameLoop {

    return {
        totalPlayTime: initialPlayTime || 0,
        day: Math.floor(initialPlayTime / (DAY_DURATION_SECONDS * 1000)) || 0,
        timeOfDay: (initialPlayTime % (DAY_DURATION_SECONDS * 1000)) || 0,
        started: Date.now(),
        dayDurationSeconds: DAY_DURATION_SECONDS,
        timeSinceLastNPC: 0,
        timeSinceLastInspection: 0,
        money: 0,
        customerHappiness: 100,
        scene,
        update,
        updateStats,
        meta: {}
    }
}

export interface GameLoop {
    scene: CoronaShopSimScene,
    totalPlayTime: number,
    day: number,
    timeOfDay: number,
    dayDurationSeconds: number,
    started: number,
    timeSinceLastNPC: number,
    timeSinceLastInspection: number,
    money: number,
    customerHappiness: number,
    update: Function,
    updateStats: Function,
    meta?: { [key: string]: any }
}

function updateStats(gameLoop: GameLoop, graphics: Phaser.GameObjects.Graphics) {

    let camera = gameLoop.scene.cameras.main

    let player = gameLoop.scene.player.sprite.body as Phaser.Physics.Arcade.Body

    let position = new Phaser.Math.Vector2(camera.scrollX + camera.width * 0.75, camera.scrollY + camera.height * 0.05)

    graphics.clear()
    graphics.setActive(true)
    // graphics.strokeRoundedRect()
    graphics
        .fillRoundedRect(
            position.x,
            position.y,
            camera.height * 0.4,
            camera.width * 0.2,
            camera.height * 0.02
        )
        .strokeRoundedRect(
            position.x,
            position.y,
            camera.height * 0.4,
            camera.width * 0.2,
            camera.height * 0.02
        )
}

function update(gameLoop: GameLoop, time: number, delta: number) {
    gameLoop.totalPlayTime = gameLoop.totalPlayTime + delta
    gameLoop.day = Math.floor(gameLoop.totalPlayTime / (gameLoop.dayDurationSeconds * 1000))
    gameLoop.timeOfDay = gameLoop.totalPlayTime % (gameLoop.dayDurationSeconds * 1000)

    gameLoop.timeSinceLastNPC += delta
    gameLoop.timeSinceLastInspection += delta

    if ((gameLoop.timeSinceLastNPC / 1000) > 10 && Object.keys(gameLoop.scene.npcs).length < 5) {
        let spawnPoint;
        if (randomIntFromInterval(0, 1) === 0) {
            spawnPoint = gameLoop.scene.spawnPoints.NPC1
        } else (
            spawnPoint = gameLoop.scene.spawnPoints.NPC2
        )

        gameLoop.scene.npcs[Date.now()] = new NPC(spawnPoint.x, spawnPoint.y, gameLoop.scene)
        gameLoop.timeSinceLastNPC = 0
    }

    if ((gameLoop.timeSinceLastInspection / 1000) > 60 && (gameLoop.scene.inspector?.destroyed || gameLoop.scene.initialInspectorFlag)) {
        let spawnPoint;
        if (randomIntFromInterval(0, 1) === 0) {
            spawnPoint = gameLoop.scene.spawnPoints.NPC1
        } else (
            spawnPoint = gameLoop.scene.spawnPoints.NPC2
        )

        gameLoop.scene.inspector = Inspector(spawnPoint.x, spawnPoint.y, gameLoop.scene)
        gameLoop.scene.inspector.sprite.play('idle_inspector')

    }

    for (const key in gameLoop.scene.shelves) {
        if (gameLoop.scene.shelves.hasOwnProperty(key)) {
            const shelf = gameLoop.scene.shelves[key];
            shelf.dirtySprites.forEach((sprite) => {
                sprite.setAlpha(shelf.dirtyness / 100)
            })
        }
    }

    // console.log(`Day ${gameLoop.day}, ${computeIngameTimeString(gameLoop.timeOfDay)}`)
}

function computeIngameTimeString(milliseconds: number): string {
    let hour = Math.floor(milliseconds / 12500)
    let minutes = Math.floor(((milliseconds % 12500) / 12500) * 60)
    return `${hour}:${minutes}`
}