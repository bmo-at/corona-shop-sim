import { Scene, Types } from "phaser";

export default class menuScreen extends Scene {
    constructor(previousSceneKey: string, config?: Types.Scenes.SettingsConfig) {
        super('gameover_screen');
        this.previousSceneKey = previousSceneKey
    }

    declare previousSceneKey: string;
    create() {
        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.R)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                this.restart()
            })

        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
            .on(Phaser.Input.Keyboard.Events.DOWN, () => {
                this.mainmenu()
            })

        let restartgame = this.add.text(
            this.cameras.main.width * .4,
            this.cameras.main.height * .5,
            'Restart game')
            .setFontFamily('Comic Sans MS')
            .setColor('black')
            .setFontSize(36)
            .setShadow(2, 2, 'white', 3, true, true)
            .setInteractive()
            .on('pointerdown', () => {
                this.restart();
            })
            .on('pointerover', () => {
                restartgame.setShadowColor('#A9A9A9')
            })
            .on('pointerout', () => {
                restartgame.setShadowColor('#FFFFFF')
            })

        let mainmenu = this.add.text(
            this.cameras.main.width * .4,
            this.cameras.main.height * .6,
            'Back to title screen')
            .setFontFamily('Comic Sans MS')
            .setColor('black')
            .setFontSize(36)
            .setShadow(2, 2, 'white', 3, true, true)
            .setInteractive()
            .on('pointerdown', () => {
                this.mainmenu();
            })
            .on('pointerover', () => {
                mainmenu.setShadowColor('#A9A9A9')
            })
            .on('pointerout', () => {
                mainmenu.setShadowColor('#FFFFFF')
            })
    }

    mainmenu() {
        this.scene.stop(this.previousSceneKey)
        this.scene.start('title_screen')
        this.scene.bringToTop('title_screen')
        this.scene.stop(this.scene.key)
    }

    restart() {
        this.scene.stop(this.previousSceneKey)
        this.scene.stop('tante_emma')
        this.scene.start('tante_emma')
        this.scene.bringToTop('tante_emma')
        this.scene.stop(this.scene.key)
    }
}