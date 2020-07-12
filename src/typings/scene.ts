import 'phaser'
import { Player as PlayerInterface } from "../entities/player"
import Player from "../entities/player"
import { Inspector as InspectorInterface } from "../entities/inspector"
import Inspector from "../entities/inspector"
import NPC from "../entities/npc"
import { GameLoop as GameLoopInterface } from "../entities/gameLoop"
import Shelf from "../entities/shelf"
import { Shelf as ShelfInterface } from "../entities/shelf"
import GameLoop from "../entities/gameLoop"
import menuScreen from '../scenes/menuScreen';
import howToPlay from '../scenes/howTopPlay';
import { Tools } from "./tools"

export class CoronaShopSimScene extends Phaser.Scene {


    constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config)
    }

    //#region Declare Attributes of the scene

    declare player: PlayerInterface
    npcs: { [key: string]: NPC } = {}
    declare inspector: InspectorInterface
    initialInspectorFlag = true

    declare cursors: Phaser.Types.Input.Keyboard.CursorKeys

    declare map: Phaser.Tilemaps.Tilemap
    declare tileset: Phaser.Tilemaps.Tileset
    declare mapLayers: { [key: string]: Phaser.Tilemaps.DynamicTilemapLayer }

    declare camera: Phaser.Cameras.Scene2D.Camera

    declare spawnPoints: { [key: string]: Phaser.GameObjects.GameObject }
    declare checkPoints: { [key: string]: Phaser.GameObjects.GameObject }
    declare colliders: { [key: string]: Phaser.GameObjects.GameObject }
    declare shelves: { [key: string]: ShelfInterface }
    declare gameLoop: GameLoopInterface

    declare store: {
        graphics: Phaser.GameObjects.Graphics
        rectangle: Phaser.Geom.Rectangle
    }

    declare statsGraphics: Phaser.GameObjects.Graphics

    declare wasd: Phaser.Types.Input.Keyboard.CursorKeys

    currentTool: Tools = Tools.STOP

    //#endregion

    init() {
        this.statsGraphics = this.add.graphics({
            fillStyle: {
                color: 0x000000, alpha: 1
            }, lineStyle: {
                color: 0xFFFFFF, alpha: 0.8, width: 4
            }
        }).setDepth(5)
    }

    pause() {
        this.scene.pause()
        this.scene.launch('menu_screen')
        this.scene.bringToTop('menu_screen')
        this.input.setDefaultCursor('')
    }

    help() {
        this.scene.pause()
        this.scene.launch('how_to_play')
        this.scene.bringToTop('how_to_play')
        this.input.setDefaultCursor('')
    }

    gameover() {
        this.scene.pause()
        this.scene.launch('gameover_screen')
        this.scene.bringToTop('gameover_screen')
        this.input.setDefaultCursor('')
    }

    preload() {
        loadCharacterAnimations(this)
        this.load.image('money', '../../assets/icons/savings_icon.png')
        this.load.image('satisfaction', '../../assets/icons/star.png')
        this.load.image('customers', '../../assets/icons/customer_number_icon.png')
    }

    create() {

        //#region Map Initialization

        this.map = this.make.tilemap({ key: "map" })
        this.tileset = this.map.addTilesetImage("tante_emma_textures", "textures")
        this.mapLayers = {
            background: this.map.createDynamicLayer("Background", this.tileset).setDepth(1),
            shadows: this.map.createDynamicLayer("Shadows", this.tileset).setDepth(1),
            midground: this.map.createDynamicLayer("Midground", this.tileset).setCollisionByProperty({ collides: true }).setDepth(2),
            foreground: this.map.createDynamicLayer("Foreground", this.tileset).setCollisionByProperty({ collides: true }).setDepth(3),
            effects: this.map.createBlankDynamicLayer("Effects", this.tileset).setDepth(4)
        }

        this.spawnPoints = {
            Player: this.map.findObject("Spawnpoints", obj => obj.name === "Player"),
            NPC1: this.map.findObject("Spawnpoints", obj => obj.name === "NPC1"),
            NPC2: this.map.findObject("Spawnpoints", obj => obj.name === "NPC2")
        }

        this.checkPoints = {
            Register: this.map.findObject("Checkpoints", obj => obj.name === "Register"),
            Hallway: this.map.findObject("Checkpoints", obj => obj.name === "Hallway"),
            Hallway2: this.map.findObject("Checkpoints", obj => obj.name === "Hallway2"),
            FarmUpstate: this.map.findObject("Checkpoints", obj => obj.name === "FarmUpstate"),
            Entrance: this.map.findObject("Checkpoints", obj => obj.name === "Entrance"),
            Hygiene: this.map.findObject("Checkpoints", obj => obj.name === "Hygiene"),
            Cereal: this.map.findObject("Checkpoints", obj => obj.name === "Cereal"),
            Bread: this.map.findObject("Checkpoints", obj => obj.name === "Bread"),
            Meat: this.map.findObject("Checkpoints", obj => obj.name === "Meat"),
            Drinks: this.map.findObject("Checkpoints", obj => obj.name === "Drinks"),
            Produce: this.map.findObject("Checkpoints", obj => obj.name === "Produce"),
            Fish: this.map.findObject("Checkpoints", obj => obj.name === "Fish"),
            Dairy: this.map.findObject("Checkpoints", obj => obj.name === "Dairy"),
            Sweets: this.map.findObject("Checkpoints", obj => obj.name === "Sweets")
        }

        //#endregion

        //#region Animation

        this.anims.create({
            key: "idle_player",
            frames: this.anims.generateFrameNumbers("player_sprite", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "idle_npc",
            frames: this.anims.generateFrameNumbers("npc_sprite", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "idle_npc_mask",
            frames: this.anims.generateFrameNumbers("npc_sprite_mask", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "idle_inspector",
            frames: this.anims.generateFrameNumbers("inspector_sprite", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        //#endregion

        //#region Player Creation and Collision

        this.player = Player(
            (this.spawnPoints.Player as any).x,
            (this.spawnPoints.Player as any).y,
            this)

        this.physics.add.collider(this.player.sprite, this.mapLayers.foreground);
        this.physics.add.collider(this.player.sprite, this.mapLayers.background);
        this.physics.add.collider(this.player.sprite, this.mapLayers.midground);

        //#endregion

        //#region Camera Initialization

        this.camera = this.cameras.main
            .startFollow(this.player.sprite)
            .setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.camera.setZoom(1)

        //#endregion

        //#region Menu/Help Screen Initialization

        this.scene.remove('menu_screen')
        this.scene.add('menu_screen', new menuScreen(this.scene.key), false)

        this.scene.remove('how_to_play')
        this.scene.add('how_to_play', new howToPlay(this.scene.key), false)

        //#endregion

        //#region Controls

        this.input.setDefaultCursor("url('../../assets/allesnurgeklaut/stop_small.png'), pointer")

        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        })

        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT
        })

        this.input.mouse.disableContextMenu()

        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.P)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                this.pause()
            })

        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                this.pause()
            })

        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.H)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                this.help()
            })

        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.PLUS)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                this.camera.setZoom(this.camera.zoom + 0.1)
            })

        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.MINUS)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                if (this.camera.zoom > 0.9) {
                    this.camera.setZoom(this.camera.zoom - 0.1)
                }
            })

        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                changeToolTo(Tools.STOP, this)
            })
        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                changeToolTo(Tools.MASK, this)
            })
        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.THREE)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                changeToolTo(Tools.CASH, this)
            })
        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.FOUR)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                changeToolTo(Tools.FORCEOUT, this)
            })
        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.FIVE)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                changeToolTo(Tools.DISINFECT, this)
            })
        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.SIX)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                changeToolTo(Tools.REFILL, this)
            })

        this.input.on(Phaser.Input.Events.POINTER_WHEEL, (pointer: Phaser.Input.Pointer) => {
            if (pointer.deltaY > 0) {
                if (this.currentTool < Tools.REFILL) { changeToolTo(this.currentTool + 1, this) }
            } else {
                if (this.currentTool > Tools.STOP) { changeToolTo(this.currentTool - 1, this) }
            }
        })

        //WIP TIME SCALING
        // this.input.keyboard
        //     .addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
        //     .on(Phaser.Input.Keyboard.Events.DOWN, () => {
        //         this.gameLoop.dayDurationSeconds = 500
        //     })

        // this.input.keyboard
        //     .addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
        //     .on(Phaser.Input.Keyboard.Events.DOWN, () => {
        //         this.gameLoop.dayDurationSeconds = 300
        //     })

        // this.input.keyboard
        //     .addKey(Phaser.Input.Keyboard.KeyCodes.THREE)
        //     .on(Phaser.Input.Keyboard.Events.DOWN, () => {
        //         this.gameLoop.dayDurationSeconds = 100
        //     })

        //#endregion

        //#region Start the game loop

        this.gameLoop = GameLoop(this, (300 / 24) * 6)

        //#endregion

        this.store = {
            graphics: this.add.graphics({
                fillStyle: {
                    color: 0x000000, alpha: 0
                }, lineStyle: {
                    color: 0x000000, alpha: 0, width: 0
                }
            }).setDepth(1),
            rectangle: new Phaser.Geom.Rectangle(192, 96, 384, 672)
        }

        this.store.graphics.fillRectShape(this.store.rectangle)
    }

    update(time: number, delta: number) {
        //#region Game Loop

        this.gameLoop.update(this.gameLoop, time, delta)

        //#endregion

        //#region Update player

        this.player.update(this.player, this.cursors, this.wasd)

        //#endregion

        //#region  Update npcs

        for (let npc_id in this.npcs) {
            if (this.npcs.hasOwnProperty(npc_id)) {
                let npc = this.npcs[npc_id]
                if (npc.destroyed) {
                    delete this.npcs[npc_id]
                } else {
                    npc.update()
                }
            }
        }

        //#endregion

        //#region Update inspector

        this.inspector?.update()

        //#endregion

        this.gameLoop.updateStats(this.gameLoop, this.statsGraphics)
    }

}

/**
 * load in all universal character animations (player, npcs, etc.)
 */
function loadCharacterAnimations(scene: CoronaShopSimScene) {

    scene.load.spritesheet("player_sprite", "../../assets/textures/spritesheets/Player_Anim.png", {
        frameWidth: 32,
        frameHeight: 36
    })

    scene.load.spritesheet("npc_sprite", "../../assets/textures/spritesheets/NPC_Anim.png", {
        frameWidth: 32,
        frameHeight: 36
    })

    scene.load.spritesheet("npc_sprite_mask", "../../assets/textures/spritesheets/NPC_maske_anim.png", {
        frameWidth: 32,
        frameHeight: 36
    })

    scene.load.spritesheet("inspector_sprite", "../../assets/textures/spritesheets/inspector_anim.png", {
        frameWidth: 32,
        frameHeight: 36
    })
}

function changeToolTo(tool: Tools, scene: CoronaShopSimScene) {
    scene.currentTool = tool
    scene.input.setDefaultCursor(`url('../../assets/icons/tools/${tool}.png'), pointer`)
}