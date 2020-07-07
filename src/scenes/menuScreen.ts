import { Scene, Types } from "phaser";

export default class menuScreen extends Scene {
    constructor(previousSceneKey: string, config?: Types.Scenes.SettingsConfig) {
        super('menu_screen');
        this.previousSceneKey = previousSceneKey
    }

    declare previousSceneKey: string;

    init() {

    }

    preload() {
    }

    create() {

        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.P)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                this.resume()
            })

        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                this.resume()
            })

        let resumegame = this.add.text(
            this.cameras.main.width * .4,
            this.cameras.main.height * .5,
            'Resume game')
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
    }

    private resume() {
        this.scene.bringToTop(this.previousSceneKey);
        this.scene.resume(this.previousSceneKey);
        this.scene.wake(this.previousSceneKey);
        this.scene.stop();
    }

    update() {

    }


}