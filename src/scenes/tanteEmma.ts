import NPC from "../npc";

export default class TanteEmma extends Phaser.Scene {
    player
    cursors: Phaser.Types.Input.Keyboard.CursorKeys

    constructor() {
        super('tante_emma');
    }

    preload() {
        this.load.spritesheet("player_sprite", "../../assets/Player_Anim1.png", {
            frameWidth: 32,
            frameHeight: 36
        })
        this.load.spritesheet("npc_sprite", "../../assets/npc_sprite.png", {
            frameWidth: 32,
            frameHeight: 32
        })

        this.load.image("textures", "../../assets/tante_emma_textures.png")
        
        this.load.tilemapTiledJSON("map", "../../assets/tante_emma_map.json")
    }

    create() {
        const map = this.make.tilemap({ key: "map" })
        const tileset = map.addTilesetImage("tante_emma_tileset", "textures")

        const backgroundLayer = map.createStaticLayer("Background", tileset)
        const floorLayer = map.createStaticLayer("Floor", tileset)
        const wallsLayer = map.createStaticLayer("Walls", tileset)
        const wallsbehindPlayerLayer = map.createStaticLayer("Walls behind P", tileset)
        const shelvesLayer = map.createStaticLayer("Shelves", tileset)
        const shelvesbehindPlayerLayer = map.createStaticLayer("Shelves behind P", tileset)
        const registerLayer = map.createStaticLayer("Register", tileset)

        wallsLayer.setCollisionByProperty({ collides: true });
        wallsLayer.setDepth(10);
        shelvesLayer.setCollisionByProperty({ collides: true });
        shelvesLayer.setDepth(10);
        registerLayer.setCollisionByProperty({ collides: true });
        registerLayer.setDepth(10);

        const spawnPointCashier = map.findObject("Objects", obj => obj.name === "Player Spawn");
        const spawnPointNPC1 = map.findObject("Objects", obj => obj.name === "NPC Spawn 1");
        const spawnPointNPC2 = map.findObject("Objects", obj => obj.name === "NPC Spawn 2");

        this.player = this.physics.add.sprite((spawnPointCashier as any).x, (spawnPointCashier as any).y, "player_sprite", 0)

        let npc1 = NPC((spawnPointNPC1 as any).x, (spawnPointNPC1 as any).y, this)
        let npc2 = NPC((spawnPointNPC2 as any).x, (spawnPointNPC2 as any).y, this)

        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("player_sprite", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        })

        this.player.play("idle");

        this.physics.add.collider(this.player, wallsLayer);
        this.physics.add.collider(this.player, shelvesLayer);
        this.physics.add.collider(this.player, registerLayer);

        const camera = this.cameras.main;
        camera.startFollow(this.player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        const speed = 100;
        // Stop any previous movement from the last frame
        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(speed);
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(speed);
        }

        // Normalize and scale the velocity so that player can't move faster along a diagonal
        this.player.body.velocity.normalize().scale(speed);
    }
}