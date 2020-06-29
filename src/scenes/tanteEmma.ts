import { CoronaShopSimScene } from "../typings/scene"
import NPC from "../entities/npc"

export default class TanteEmma extends CoronaShopSimScene {

    constructor() {
        super('tante_emma');
    }

    preload() {

        super.preload()

        this.load.image("textures", "../../assets/tante_emma_textures.png")
        this.load.tilemapTiledJSON("map", "../../assets/tante_emma_map.json")
        this.load.atlas("test", "../../assets/test.png", "../../assets/test_atlas.json")
    }

    create() {
        super.create()

        this.shelves.push(...this.map
            .createFromObjects(
                "Shelves",
                "bottom_half_shelf_1",
                { depth: 3, key: "test", frame: "row-8-col-8" }
            ))
        this.shelves.push(...this.map
            .createFromObjects(
                "Shelves",
                "bottom_half_shelf_2",
                { depth: 3, key: "test", frame: "row-10-col-2" }
            ))
        this.shelves.push(...this.map
            .createFromObjects(
                "Shelves",
                "top_shelf",
                { depth: 3, key: "test", frame: "row-3-col-6", }
            ))
        this.shelves.push(...this.map
            .createFromObjects(
                "Shelves",
                "top_shelf_end",
                { depth: 3, key: "test", frame: "row-5-col-6" }
            ))
        this.shelves.push(...this.map
            .createFromObjects(
                "Shelves",
                "side_shelf",
                { depth: 3, key: "test", frame: "row-9-col-5" }
            ))
        let shelvesGroup = new Phaser.GameObjects.Group(this, ...this.shelves)
        // shelvesGroup.se
        this.physics.add.collider(shelvesGroup, this.player.sprite)

        //WIP
        let registerCollider = this.map
            .findObject("Objects", obj => obj.name === "RegisterCollider")
        let test = this.physics.add.group(registerCollider)
        this.physics.add
            .collider(this.player.sprite, test, () => { console.log("TEST") })
    }

    update(time: number, delta: number) {
        super.update(time, delta)
    }
}