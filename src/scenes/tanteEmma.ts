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

        this.load.image('basket_bottom_dirt', '../../assets/textures/tante_emma_atlas/dirt/basket_bottom_dirt.png')
        this.load.image('basket_dirt', '../../assets/textures/tante_emma_atlas/dirt/basket_dirt.png')
        this.load.image('basket_side_bottom_dirt', '../../assets/textures/tante_emma_atlas/dirt/basket_side_bottom_dirt.png')
        this.load.image('basket_side_dirt', '../../assets/textures/tante_emma_atlas/dirt/basket_side_dirt.png')
        this.load.image('basket_side_top_dirt', '../../assets/textures/tante_emma_atlas/dirt/basket_side_top_dirt.png')
        this.load.image('basket_top_dirt', '../../assets/textures/tante_emma_atlas/dirt/basket_top_dirt.png')
        this.load.image('doubleshelves_side_dirt', '../../assets/textures/tante_emma_atlas/dirt/doubleshelves_side_dirt.png')
        this.load.image('doubleshelves_bottom_corner_dirt', '../../assets/textures/tante_emma_atlas/dirt/doubleshelves_bottom_corner_dirt.png')
        this.load.image('shelves_bottom_dirt', '../../assets/textures/tante_emma_atlas/dirt/shelves_bottom_dirt.png')
        this.load.image('shelves_dirt', '../../assets/textures/tante_emma_atlas/dirt/shelves_dirt.png')
        this.load.image('shelves_side_bottom_dirt', '../../assets/textures/tante_emma_atlas/dirt/shelves_side_bottom_dirt.png')
        this.load.image('shelves_side_dirt', '../../assets/textures/tante_emma_atlas/dirt/shelves_side_dirt.png')
        this.load.image('shelves_top_dirt', '../../assets/textures/tante_emma_atlas/dirt/shelves_top_dirt.png')

    }

    create() {
        super.create()

        this.shelves = {
            Hygiene: Shelf(this.checkPoints.Hygiene, this, 10, [this.mapLayers.foreground.getTileAt(7, 18), this.mapLayers.foreground.getTileAt(7, 19), this.mapLayers.foreground.getTileAt(7, 20)]),
            Cereal: Shelf(this.checkPoints.Cereal, this, 10, [this.mapLayers.foreground.getTileAt(7, 15), this.mapLayers.foreground.getTileAt(7, 16), this.mapLayers.foreground.getTileAt(7, 17)]),
            Bread: Shelf(this.checkPoints.Bread, this, 10, [this.mapLayers.foreground.getTileAt(8, 5), this.mapLayers.foreground.getTileAt(8, 6), this.mapLayers.foreground.getTileAt(9, 5), this.mapLayers.foreground.getTileAt(9, 6)]),
            Meat: Shelf(this.checkPoints.Meat, this, 10, [this.mapLayers.foreground.getTileAt(11, 5), this.mapLayers.foreground.getTileAt(11, 6), this.mapLayers.foreground.getTileAt(12, 5), this.mapLayers.foreground.getTileAt(12, 6)]),
            Drinks: Shelf(this.checkPoints.Drinks, this, 10, [this.mapLayers.foreground.getTileAt(12, 18), this.mapLayers.foreground.getTileAt(12, 19), this.mapLayers.foreground.getTileAt(12, 20)]),
            Produce: Shelf(this.checkPoints.Produce, this, 10, [this.mapLayers.foreground.getTileAt(15, 16)]),
            Fish: Shelf(this.checkPoints.Fish, this, 10, [this.mapLayers.foreground.getTileAt(10, 9)]),
            Dairy: Shelf(this.checkPoints.Dairy, this, 10, [this.mapLayers.foreground.getTileAt(7, 8), this.mapLayers.foreground.getTileAt(7, 9), this.mapLayers.foreground.getTileAt(7, 10)]),
            Sweets: Shelf(this.checkPoints.Sweets, this, 10, [this.mapLayers.foreground.getTileAt(11, 15), this.mapLayers.foreground.getTileAt(11, 16), this.mapLayers.foreground.getTileAt(11, 17)])
        }

        // //WIP
        // let registerCollider = this.map
        //     .findObject("Colliders", obj => obj.name === "RegisterCollider")
        // let test = this.physics.add.group(registerCollider)
        // this.physics.add
        //     .collider(this.player.sprite, test, () => { console.log("TEST") })
    }

    update(time: number, delta: number) {
        super.update(time, delta)
    }
}