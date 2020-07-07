import { Scene, Types } from "phaser";

export default class titleScreen extends Scene {
    constructor(config: Types.Scenes.SettingsConfig) {
        super('title_screen');
    }

    init() {

    }

    preload() {
        this.load.image('background', '../../assets/tante_emma_map.png')
        this.load.spritesheet("player_sprite", "../../assets/textures/spritesheets/Player_Anim.png", {
            frameWidth: 32,
            frameHeight: 36
        })
    }

    create() {

        this.anims.create({
            key: "idle_player",
            frames: this.anims.generateFrameNumbers("player_sprite", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });


        let shopkeep = this.add.sprite(
            this.cameras.main.width * .78,
            this.cameras.main.height * .75,
            'player_sprite')
            .setScale(6)
            .play('idle_player')
            .setAlpha(0.8)
            .setDepth(1)

        let background = this.add.tileSprite(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            'background')
            .setAlpha(0.55)

        let title = this.add.text(
            this.cameras.main.width * .2,
            this.cameras.main.height * .3,
            'Corona Shop Simulator')
            .setFontFamily('Comic Sans MS')
            .setColor('black')
            .setFontSize(72)
            .setShadow(2, 2, 'white', 3, true, true)

        let startgame = this.add.text(
            this.cameras.main.width * .4,
            this.cameras.main.height * .5,
            'Start game')
            .setFontFamily('Comic Sans MS')
            .setColor('black')
            .setFontSize(36)
            .setShadow(2, 2, 'white', 3, true, true)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('tante_emma')
            })
            .on('pointerover', () => {
                startgame.setShadowColor('#A9A9A9')
            })
            .on('pointerout', () => {
                startgame.setShadowColor('#FFFFFF')
            })

        let options = this.add.text(
            this.cameras.main.width * .425,
            this.cameras.main.height * .6,
            'Options')
            .setFontFamily('Comic Sans MS')
            .setColor('black')
            .setFontSize(36)
            .setShadow(2, 2, 'white', 3, true, true)
            .setInteractive()
            .on('pointerdown', () => {
                window.alert("Not yet implemented")
            })
            .on('pointerover', () => {
                options.setShadowColor('#A9A9A9')
            })
            .on('pointerout', () => {
                options.setShadowColor('#FFFFFF')
            })
    }

    update() {

    }


}