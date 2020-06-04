export default function NPC(x: number, y: number, scene: Phaser.Scene) {
    var enemy = scene.add.sprite(x, y, "npc_sprite");
    // enemy.state = 'patrol';
    // enemy.xDest = x;
    // enemy.yDest = y;
    // enemy.animations.add('wait', [544, 545], 4);
    // enemy.direction = 1;
    // enemy.frame = 544;
    // enemy.anchor.setTo(.5, 1);
    // enemy.scale.x = -1;

    // enemy.goToXY = function (x, y) {
    //     enemy.xDest = x;
    //     enemy.yDest = y;
    // }

    // enemy.update = function () {
    //     var self = this;
    //     switch (self.state) {
    //         case 'patrol':
    //             self.speed = 40;
    //             self.patrol();
    //             break;
    //         case 'alarm':
    //             self.speed = 0;
    //             self.stop();
    //             break;
    //     }
    //     move(self);
    // }

    // enemy.stop = function () {
    //     var self = this;
    //     self.xDest = self.x;
    //     self.yDest = self.y;
    // }

    // enemy.patrol = function () {
    //     var self = this;
    //     if (Math.floor(self.x / 10) == Math.floor(self.xDest / 10)) {
    //         self.direction = self.direction * -1;
    //         self.goToXY(self.x + self.direction * 100);
    //     }
    // }
    return enemy;
}