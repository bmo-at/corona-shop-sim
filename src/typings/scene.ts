import { Player as PlayerInterface } from "../entities/player"
import Player from "../entities/player"
import { NPC } from "../entities/npc"
import { GameLoop as GameLoopInterface } from "../entities/gameLoop"
import GameLoop from "../entities/gameLoop"

export class CoronaShopSimScene extends Phaser.Scene {


    constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config)
    }

    //#region Declare Attributes of the scene

    declare player: PlayerInterface
    npcs: { [key: string]: NPC } = {}

    declare cursors: Phaser.Types.Input.Keyboard.CursorKeys

    declare map: Phaser.Tilemaps.Tilemap
    declare tileset: Phaser.Tilemaps.Tileset
    declare mapLayers: { [key: string]: Phaser.Tilemaps.StaticTilemapLayer | Phaser.Tilemaps.DynamicTilemapLayer }

    declare camera: Phaser.Cameras.Scene2D.Camera

    declare spawnPoints: { [key: string]: Phaser.GameObjects.GameObject }
    shelves: Phaser.GameObjects.Sprite[] = []
    declare gameLoop: GameLoopInterface

    //#endregion

    pause() {
        this.gameLoop.paused = true
        this.player.sprite.anims.pause()
        for (const npc_id in this.npcs) {
            if (this.npcs.hasOwnProperty(npc_id)) {
                const npc = this.npcs[npc_id]
                npc.sprite.anims.pause()
            }
        }

        //Set Velocities to 0
        (this.player.sprite.body as Phaser.Physics.Arcade.Body).setVelocity(0)
        for (const npc_id in this.npcs) {
            if (this.npcs.hasOwnProperty(npc_id)) {
                const npc = this.npcs[npc_id];
                (npc.sprite.body as Phaser.Physics.Arcade.Body).setVelocity(0)
            }
        }
    }

    unpause() {
        this.gameLoop.paused = false
        this.player.sprite.anims.resume()
        for (const npc_id in this.npcs) {
            if (this.npcs.hasOwnProperty(npc_id)) {
                const npc = this.npcs[npc_id];
                npc.sprite.anims.resume()
            }
        }
    }

    preload() {
        loadCharacterAnimations(this)
    }

    create() {

        //#region Map Initialization

        this.map = this.make.tilemap({ key: "map" })
        this.tileset = this.map.addTilesetImage("tante_emma_tileset", "textures")
        this.mapLayers = {
            background: this.map.createDynamicLayer("Background", this.tileset).setDepth(1),
            shadows: this.map.createDynamicLayer("Shadows", this.tileset).setDepth(1),
            midground: this.map.createDynamicLayer("Midground", this.tileset).setCollisionByProperty({ collides: true }).setDepth(2),
            foreground: this.map.createDynamicLayer("Foreground", this.tileset).setCollisionByProperty({ collides: true }).setDepth(3)
        }

        this.spawnPoints = {
            Cashier: this.map.findObject("Objects", obj => obj.name === "Player Spawn"),
            NPC1: this.map.findObject("Objects", obj => obj.name === "NPC Spawn 1"),
            NPC2: this.map.findObject("Objects", obj => obj.name === "NPC Spawn 2")
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

        //#endregion

        //#region Player Creation and Collision

        this.player = Player(
            (this.spawnPoints.Cashier as any).x,
            (this.spawnPoints.Cashier as any).y,
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

        //#region Controls

        this.cursors = this.input.keyboard.createCursorKeys()
        this.input.mouse.disableContextMenu()

        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.P)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                if (this.gameLoop.paused) {
                    this.unpause();
                } else {
                    this.pause();
                }
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
            .addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                if (this.gameLoop.paused) {
                    this.unpause();
                    //HIDE MENU
                } else {
                    this.pause();
                    //SHOW MENU
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

    }

    update(time: number, delta: number) {


        if (this.gameLoop.paused) {
            console.log("Game is paused")
        } else {

            //#region Game Loop

            this.gameLoop.update(this.gameLoop, time, delta)

            //#endregion

            //#region Update player

            this.player.update(this.player, this.cursors)

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
        }
    }
}

/**
 * load in all universal character animations (player, npcs, etc.)
 */
function loadCharacterAnimations(scene: CoronaShopSimScene) {

    scene.load.spritesheet("player_sprite", "../../assets/Player_Anim1.png", {
        frameWidth: 32,
        frameHeight: 36
    })

    scene.load.spritesheet("npc_sprite", "../../assets/NPC_Anim.png", {
        frameWidth: 32,
        frameHeight: 36
    })

    scene.load.spritesheet("npc_sprite_mask", "../../assets/NPC_maske_anim.png", {
        frameWidth: 32,
        frameHeight: 36
    })
}