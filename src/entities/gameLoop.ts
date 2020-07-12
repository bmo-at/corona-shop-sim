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

    let camera = scene.cameras.main

    let money = scene.add.image(camera.width * 0.78, camera.height * 0.1, 'money').setDepth(6).setScale(0.1)
    let satisfaction = scene.add.image(camera.width * 0.78, camera.height * 0.17, 'satisfaction').setDepth(6).setScale(0.2)
    let customers = scene.add.image(camera.width * 0.78, camera.height * 0.24, 'customers').setDepth(6).setScale(0.3)

    let moneytext = scene.add.text(camera.width * 0.8, camera.height * 0.08, "").setFontFamily("Comic Sans MS").setFontSize(24).setDepth(6)
    let satisfactiontext = scene.add.text(camera.width * 0.8, camera.height * 0.15, "").setFontFamily("Comic Sans MS").setFontSize(24).setDepth(6)
    let customerstext = scene.add.text(camera.width * 0.8, camera.height * 0.22, "").setFontFamily("Comic Sans MS").setFontSize(24).setDepth(6)

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
        meta: {
            statTextures: {
                money,
                satisfaction,
                customers
            },
            statTexts: {
                moneytext,
                satisfactiontext,
                customerstext
            }
        }
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
    meta: { [key: string]: any }
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
            camera.width * 0.14,
            camera.height * 0.02
        )
        .strokeRoundedRect(
            position.x,
            position.y,
            camera.height * 0.4,
            camera.width * 0.14,
            camera.height * 0.02
        );

    let money = gameLoop.meta.statTextures.money as Phaser.GameObjects.Image
    let satisfaction = gameLoop.meta.statTextures.satisfaction as Phaser.GameObjects.Image
    let customers = gameLoop.meta.statTextures.customers as Phaser.GameObjects.Image

    money.setX(camera.scrollX + (camera.width * 0.78))
    satisfaction.setX(camera.scrollX + (camera.width * 0.78))
    customers.setX(camera.scrollX + (camera.width * 0.78))

    money.setY(camera.scrollY + (camera.height * 0.1))
    satisfaction.setY(camera.scrollY + (camera.height * 0.17))
    customers.setY(camera.scrollY + (camera.height * 0.24))

    let moneytext = gameLoop.meta.statTexts.moneytext as Phaser.GameObjects.Text
    let satisfactiontext = gameLoop.meta.statTexts.satisfactiontext as Phaser.GameObjects.Text
    let customerstext = gameLoop.meta.statTexts.customerstext as Phaser.GameObjects.Text

    let npcs_in_store = []

    for (const npc in gameLoop.scene.npcs) {
        if (gameLoop.scene.npcs.hasOwnProperty(npc)) {
            const x = gameLoop.scene.npcs[npc];
            if (gameLoop.scene.store.rectangle.contains(x.sprite.x, x.sprite.y)) {
                npcs_in_store.push(x)
            }
        }
    }

    moneytext.setX(camera.scrollX + (camera.width * 0.8)).setY(camera.scrollY + (camera.height * 0.08)).setText(`${gameLoop.money} $`)
    satisfactiontext.setX(camera.scrollX + (camera.width * 0.8)).setY(camera.scrollY + (camera.height * 0.15)).setText(`${gameLoop.customerHappiness}% satisfaction`)
    customerstext.setX(camera.scrollX + (camera.width * 0.8)).setY(camera.scrollY + (camera.height * 0.22)).setText(`${npcs_in_store.length}/2 customers`)
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