
const XElement = require('./xelement')

const ShapeTree = require('./components/ShapeTree')

const Sp = require('./components/elements/p-sp')
const Pic = require('./components/elements/p-pic')
const GroupSp = require("./components/elements/p-grpSp")

const GraphicFrame = require("./components/elements/p-graphicFrame")

const SlideBg = require("./components/elements/p-bg")

const TxBody = require("./components/elements/p-txBody")

const Transition = require("./components/elements/p-transition")

const BaseSlide = require("./base-slide")

class SlideXML extends BaseSlide {
    constructor(xml) {

        super(xml)

        this.type = "slide"

    }

    get nodes() {

        let obj = {
            backgroundImage: this.backgroundImg || this.layout.backgroundImg || this.master.backgroundImg,
            blocks: [],
            backgroundColor: this.backgroundColor || this.layout.backgroundColor || this.master.backgroundColor
        }

        let trans = this.transition || this.master.transition

        if(trans){
            obj.transition = trans
        }


        let arry = [...this.master.parseElements(),...this.layout.parseElements(),...this.parseElements()]


        obj.blocks = arry

        this._json = obj

        return obj
    }

    get json() {

    }

    /**
     * @param {import('./slide-layout')} v
     */
    set layout(v) {
        this.layoutxml = v
    }

    get layout() {
        return this.layoutxml
    }


    /**
     * @param {XElement} node 
     */
    getTextVerticalAlign(node) {
        let baseline = node.selectFirst(['a:rPr', 'attrs', 'baseline'])
        if (baseline) {
            return +baseline / 1000
        }
    }

    /**
     * 
     * @param {XElement} node 
     */
    getShapeFillOfNode(node) {
        let fillType = node.selectFirst(['p:spPr'])
        if (fillType.get("a:solidFill")) {
            let color = node.selectFirst(['p:spPr', 'a:solidFill'])
            if (color.get('a:srgbClr')) {
                return color.selectFirst(["a:srgbClr", "attrs", "val"])
            }
        }
        return undefined
    }
  
}


module.exports = SlideXML