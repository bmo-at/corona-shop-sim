import 'phaser';
import { Types } from "phaser";

import TanteEmma from "./scenes/tanteEmma";
import SuperMarkt from "./scenes/superMarkt";
import WarenHaus from "./scenes/warenHaus";
import EinkaufsMeile from "./scenes/einkaufsMeile";

const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    width: 800,
    height: 800,
    scene: TanteEmma,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 } // Top down game, so no gravity
        }
    }
};

const game = new Phaser.Game(config);