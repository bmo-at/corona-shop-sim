import { Game } from "phaser";
import NPC from "./npc";
import { CoronaShopSimScene } from "../typings/scene";
import { randomIntFromInterval } from "../util/helperMethods";

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

    const instance_DAY_DURATION_SECONDS = DAY_DURATION_SECONDS

    return {
        totalPlayTime: initialPlayTime || 0,
        day: Math.floor(initialPlayTime / (DAY_DURATION_SECONDS * 1000)) || 0,
        timeOfDay: (initialPlayTime % (DAY_DURATION_SECONDS * 1000)) || 0,
        started: Date.now(),
        dayDurationSeconds: DAY_DURATION_SECONDS,
        paused: false,
        timeSinceLastNPC: 0,
        scene,
        update
    }
}

export interface GameLoop {
    scene: CoronaShopSimScene,
    totalPlayTime: number,
    day: number,
    timeOfDay: number,
    dayDurationSeconds: number,
    started: number,
    paused: boolean,
    timeSinceLastNPC: number,
    update: Function,
    meta?: { [key: string]: any }
}

function update(gameLoop: GameLoop, time: number, delta: number) {
    gameLoop.totalPlayTime = gameLoop.totalPlayTime + delta
    gameLoop.day = Math.floor(gameLoop.totalPlayTime / (gameLoop.dayDurationSeconds * 1000))
    gameLoop.timeOfDay = gameLoop.totalPlayTime % (gameLoop.dayDurationSeconds * 1000)

    gameLoop.timeSinceLastNPC += delta

    if ((gameLoop.timeSinceLastNPC / 1000) > 15) {
        let spawnPoint;
        if (randomIntFromInterval(0, 1) === 0) {
            spawnPoint = gameLoop.scene.spawnPoints.NPC1
        } else (
            spawnPoint = gameLoop.scene.spawnPoints.NPC2
        )

        gameLoop.scene.npcs[Date.now()] = NPC(spawnPoint.x, spawnPoint.y, gameLoop.scene)
        gameLoop.timeSinceLastNPC = 0
    }

    // console.log(`Day ${gameLoop.day}, ${computeIngameTimeString(gameLoop.timeOfDay)}`)
}

function computeIngameTimeString(milliseconds: number): string {
    let hour = Math.floor(milliseconds / 12500)
    let minutes = Math.floor(((milliseconds % 12500) / 12500) * 60)
    return `${hour}:${minutes}`
}