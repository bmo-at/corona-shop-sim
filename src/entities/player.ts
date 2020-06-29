import { CoronaShopSimScene } from "../typings/scene";

export default function Player(x: number, y: number, scene: Phaser.Scene): Player {
    let player: Player = {
        sprite: scene.physics.add.sprite(x, y, "player_sprite", 0).play("idle_player").setDepth(2),
        interactionRadius: {
            graphics: scene.add.graphics({
                fillStyle: {
                    color: 0x00FFFF, alpha: 0.3
                }, lineStyle: {
                    color: 0x000000, alpha: 0.5, width: 1
                }
            }).setDepth(1),
            circle: new Phaser.Geom.Circle(x + 16, y + 16, 100)
        },
        update
    }

    return player
}

function update(player: Player, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {

    const speed = 100;

    let body = player.sprite.body as Phaser.Physics.Arcade.Body

    // Stop any previous movement from the last frame

    body.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown) {
        body.setVelocityX(-speed);
    } else if (cursors.right.isDown) {
        body.setVelocityX(speed);
    }

    // Vertical movement
    if (cursors.up.isDown) {
        body.setVelocityY(-speed);
    } else if (cursors.down.isDown) {
        body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    body.velocity.normalize().scale(speed);

    player.interactionRadius.circle.x = body.x + 16
    player.interactionRadius.circle.y = body.y + 16
    player.interactionRadius.graphics.clear()
    player.interactionRadius.graphics.fillCircleShape(player.interactionRadius.circle)
}

export interface Player {
    sprite: Phaser.GameObjects.Sprite
    interactionRadius: {
        graphics: Phaser.GameObjects.Graphics,
        circle: Phaser.Geom.Circle
    }
    update: Function
}