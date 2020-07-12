import { Scene, Types } from "phaser";
import { CoronaShopSimScene } from "../typings/scene";

export default class menuScreen extends Scene {
    constructor(previousSceneKey: string, config?: Types.Scenes.SettingsConfig) {
        super('how_to_play');
        this.previousSceneKey = previousSceneKey
    }

    declare previousSceneKey: string;

    init() {

    }

    preload() {
        this.load.image('howto', '../../assets/textures/howto_small.png')
    }

    create() {

        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                this.resume()
            })

        let howto = this.add.image(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'howto')
            .setScale(this.cameras.main.height / 1080)

        if (this.scene.get(this.previousSceneKey) instanceof CoronaShopSimScene) {
            let resumegame = this.add.text(
                this.cameras.main.width * .7,
                this.cameras.main.height * .9,
                'Resume game (ESC)')
                .setFontFamily('Comic Sans MS')
                .setColor('black')
                .setFontSize(36)
                .setShadow(2, 2, 'white', 3, true, true)
                .setInteractive()
                .on('pointerdown', () => {
                    this.resume();
                })
                .on('pointerover', () => {
                    resumegame.setShadowColor('#A9A9A9')
                })
                .on('pointerout', () => {
                    resumegame.setShadowColor('#FFFFFF')
                })
            howto.setAlpha(0.9)
        } else {
            let backtotitle = this.add.text(
                this.cameras.main.width * .6,
                this.cameras.main.height * .9,
                'Back to tile screen (ESC)')
                .setFontFamily('Comic Sans MS')
                .setColor('black')
                .setFontSize(36)
                .setShadow(2, 2, 'white', 3, true, true)
                .setInteractive()
                .on('pointerdown', () => {
                    this.resume();
                })
                .on('pointerover', () => {
                    backtotitle.setShadowColor('#A9A9A9')
                })
                .on('pointerout', () => {
                    backtotitle.setShadowColor('#FFFFFF')
                })
        }
    }

    private resume() {
        this.scene.bringToTop(this.previousSceneKey);
        this.scene.resume(this.previousSceneKey);
        this.scene.wake(this.previousSceneKey);
        if (this.scene.get(this.previousSceneKey) instanceof CoronaShopSimScene) {
            this.scene.get(this.previousSceneKey).input.setDefaultCursor(`url('../../assets/icons/tools/${(this.scene.get(this.previousSceneKey) as CoronaShopSimScene).currentTool}.png'), pointer`)
        }
        this.scene.stop();
    }

    update() {
    }
}