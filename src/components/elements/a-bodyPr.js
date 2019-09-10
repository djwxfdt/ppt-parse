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
    }
}