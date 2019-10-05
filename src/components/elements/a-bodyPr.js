const XElement = require('../../xelement')

/**
 * This element defines the body properties for the text body within a shape.
 */
module.exports = class BodyPr {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        if (Object.keys(node.attributes).length == 0) {
            this.isEmpty = true
            return
        }

        const anchorMap = {
            b: 'bottom', // Anchor the text at the bottom of the bounding rectangle.
            ctr: 'center', // Anchor the text at the middle of the bounding rectangle.
            t: 'top' // Anchor the text at the top of the bounding rectangle.
        }

        /**
         * @type {"bottom"|"center"|"top"}
         */
        this.anchor = node.attributes.anchor || 't'

        this.anchor = anchorMap[this.anchor]

        const bIns = node.attributes.bIns
        const lIns = node.attributes.lIns
        const rIns = node.attributes.rIns
        const tIns = node.attributes.tIns

        if (bIns || lIns || rIns || tIns) {
            this.padding = {
                l: (+(lIns || 0) * 96) / 914400,
                r: (+(rIns || 0) * 96) / 914400,
                b: (+(bIns || 0) * 96) / 914400,
                t: (+(tIns || 0) * 96) / 914400
            }

            if (
                this.padding.l +
                    this.padding.r +
                    this.padding.b +
                    this.padding.t ==
                0
            ) {
                this.padding = null
            }
        }
    }
}
