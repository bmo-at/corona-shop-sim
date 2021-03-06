import 'phaser';

import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import WebfontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin.js';

import TanteEmma from "./scenes/tanteEmma";
import SuperMarkt from "./scenes/superMarkt";
import WarenHaus from "./scenes/warenHaus";
import EinkaufsMeile from "./scenes/einkaufsMeile";
import titleScreen from './scenes/titleScreen';
import gameoverScreen from './scenes/gameoverScreen';
import howToPlay from './scenes/howTopPlay';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    width: 1280,
    height: 720,
    scene: [titleScreen, gameoverScreen, howToPlay, TanteEmma],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 } // Top down game, so no gravity
        }
    }
};

const game = new Phaser.Game(config);