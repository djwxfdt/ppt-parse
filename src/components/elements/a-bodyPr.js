const XElement = require('../../xelement')

/**
 * This element defines the body properties for the text body within a shape.
 */
module.exports = class BodyPr{
    /**
     * @param {XElement} node 
     */
    constructor(node){

        let anchorMap = {
            b:"bottom",//Anchor the text at the bottom of the bounding rectangle.
            ctr:"center",//Anchor the text at the middle of the bounding rectangle.
            t:"top",//Anchor the text at the top of the bounding rectangle.
        }

        /**
         * @type {"bottom"|"center"|"top"}
         */
        this.anchor = node.attributes.anchor || "t"

        this.anchor = anchorMap[this.anchor]

        let bIns = node.attributes.bIns
        let lIns = node.attributes.lIns
        let rIns = node.attributes.rIns
        let tIns = node.attributes.tIns

        if(bIns || lIns || rIns || tIns){
            this.padding = {
                l:+(lIns || 0) * 96 / 914400,
                r:+(rIns || 0) * 96 / 914400,
                b:+(bIns || 0) * 96 / 914400,
                t:+(tIns || 0) * 96 / 914400,
            }

            if((this.padding.l + this.padding.r + this.padding.b + this.padding.t) == 0){
                this.padding = null
            }
        }
    }
}