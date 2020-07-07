import { CoronaShopSimScene } from "../typings/scene"
import NPC from "../entities/npc"
import Shelf from "../entities/shelf";

export default class TanteEmma extends CoronaShopSimScene {

    constructor() {
        super('tante_emma');
    }

    preload() {

        super.preload()

        this.load.image("textures", "../../assets/textures/tante_emma_atlas/tante_emma_textures.png")
        this.load.tilemapTiledJSON("map", "../../assets/tante_emma_map.json")
        this.load.atlas(
            "atlas",
            "../../assets/textures/tante_emma_atlas/tante_emma_textures.png",
            "../../assets/textures/tante_emma_atlas/tante_emma_textures_atlas.json")
        console.log(this.textures)
    }

    create() {
        super.create()

        this.shelves = {
            Hygiene: Shelf(this.checkPoints.Hygiene, this, 0, [this.mapLayers.foreground.getTileAt(7, 18, true), this.mapLayers.foreground.getTileAt(7, 19, true), this.mapLayers.foreground.getTileAt(7, 20, true)]),
            Cereal: Shelf(this.checkPoints.Cereal, this, 0, [this.mapLayers.foreground.getTileAt(7, 15, true), this.mapLayers.foreground.getTileAt(7, 16, true), this.mapLayers.foreground.getTileAt(7, 17, true)]),
            Bread: Shelf(this.checkPoints.Bread, this, 0, [this.mapLayers.foreground.getTileAt(8, 5, true), this.mapLayers.foreground.getTileAt(8, 6, true), this.mapLayers.foreground.getTileAt(9, 5, true), this.mapLayers.foreground.getTileAt(9, 6, true)]),
            Meat: Shelf(this.checkPoints.Meat, this, 0, [this.mapLayers.foreground.getTileAt(11, 5, true), this.mapLayers.foreground.getTileAt(11, 6, true), this.mapLayers.foreground.getTileAt(12, 5, true), this.mapLayers.foreground.getTileAt(12, 6, true)]),
            Drinks: Shelf(this.checkPoints.Drinks, this, 0, [this.mapLayers.foreground.getTileAt(12, 18, true), this.mapLayers.foreground.getTileAt(12, 19, true), this.mapLayers.foreground.getTileAt(12, 20, true)]),
            Produce: Shelf(this.checkPoints.Produce, this, 0, [this.map.getTileAt(15, 16, true)]),
            Fish: Shelf(this.checkPoints.Fish, this, 0, [this.map.getTileAt(10, 9, true)]),
            Dairy: Shelf(this.checkPoints.Dairy, this, 0, [this.mapLayers.foreground.getTileAt(7, 8, true), this.mapLayers.foreground.getTileAt(7, 9, true), this.mapLayers.foreground.getTileAt(7, 10, true)]),
            Sweets: Shelf(this.checkPoints.Sweets, this, 0, [this.mapLayers.foreground.getTileAt(11, 15, true), this.mapLayers.foreground.getTileAt(11, 16, true), this.mapLayers.foreground.getTileAt(11, 17, true)])
        }

        //WIP
        let registerCollider = this.map
            .findObject("Colliders", obj => obj.name === "RegisterCollider")
        let test = this.physics.add.group(registerCollider)
        this.physics.add
            .collider(this.player.sprite, test, () => { console.log("TEST") })
    }

    update(time: number, delta: number) {
        super.update(time, delta)
    }
}