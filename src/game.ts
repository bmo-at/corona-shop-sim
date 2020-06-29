import 'phaser';
import { Types } from "phaser";

import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";

import TanteEmma from "./scenes/tanteEmma";
import SuperMarkt from "./scenes/superMarkt";
import WarenHaus from "./scenes/warenHaus";
import EinkaufsMeile from "./scenes/einkaufsMeile";

const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    width: 1280,
    height: 720,
    scene: TanteEmma,
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
        },
        ]
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 } // Top down game, so no gravity
        }
    }
};

const game = new Phaser.Game(config);