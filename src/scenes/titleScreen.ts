import { Scene, Types } from "phaser";
import howToPlay from '../scenes/howTopPlay';

export default class titleScreen extends Scene {
    constructor(config: Types.Scenes.SettingsConfig) {
        super('title_screen');
    }

    init() {

    }

    preload() {
        this.load.image('background', '../../assets/tante_emma_map.png')
        this.load.image('corona', '../../assets/icons/corona.png')
        this.load.spritesheet("player_sprite_homescreen", "../../assets/textures/spritesheets/Player_Anim_homescreen.png", {
            frameWidth: 192,
            frameHeight: 216
        })
    }

    create() {

        this.anims.create({
            key: "idle_player_homescreen",
            frames: this.anims.generateFrameNumbers("player_sprite_homescreen", { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.remove('how_to_play')
        this.scene.add('how_to_play', new howToPlay(this.scene.key), false)

        let shopkeep = this.add.sprite(
            this.cameras.main.width * .78,
            this.cameras.main.height * .75,
            'player_sprite_homescreen')
            // .setScale(6)
            .play('idle_player_homescreen')
            .setAlpha(0.8)
            .setDepth(1)

        let corona = this.add.sprite(
            this.cameras.main.width * 0.1,
            this.cameras.main.height * 0.35,
            'corona')
            .setAlpha(0.9)
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

        let howto = this.add.text(
            this.cameras.main.width * .4,
            this.cameras.main.height * .6,
            'How to play')
            .setFontFamily('Comic Sans MS')
            .setColor('black')
            .setFontSize(36)
            .setShadow(2, 2, 'white', 3, true, true)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.pause()
                this.scene.launch('how_to_play')
                this.scene.bringToTop('how_to_play')
                this.input.setDefaultCursor('')
            })
            .on('pointerover', () => {
                howto.setShadowColor('#A9A9A9')
            })
            .on('pointerout', () => {
                howto.setShadowColor('#FFFFFF')
            })
    }

    update() {

    }


}