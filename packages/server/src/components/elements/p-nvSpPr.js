const CNvPr = require('./p-cNvPr')
const NvPr = require('./p-nvPr')
const XElement = require('../../xelement')

/**
 * This element specifies all non-visual properties for a shape.
 * This element is a container for the non-visual identification properties,
 *  shape properties and application properties that are to be associated with a shape.
 * This allows for additional information that does not affect the appearance of the shape to be stored.
 */
module.exports = class NvSpPr {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        let cNvPr = node.selectFirst(['p:cNvPr'])
        if (cNvPr) {
            this.cNvPr = new CNvPr(cNvPr)
        }

        let nvPr = node.getSingle('p:nvPr')
        if (nvPr) {
            this.nvPr = new NvPr(nvPr)
        }

        let cNvSpPr = node.getSingle('p:cNvSpPr')
        if (cNvSpPr) {
            /**
             * Specifies that the corresponding shape is a text box and thus should be treated as such by the generating application. If this attribute is omitted then it is assumed that the corresponding shape is not specifically a text box.
             */
            this.txBox = cNvSpPr.attributes.txBox == '1'
        }
    }
}
