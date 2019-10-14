const XElement = require('../../xelement')

/**
 * This element specifies the precense of a shape guide that will be used to govern the geometry of the specified shape. A shape guide consists of a formula and a name that the result of the formula is assigned to. Recognized formulas are listed with the <fmla> attribute documentation for this element.
 */
class Gd {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.name = node.attributes.name

        /**
         * Specifies the formula that will be used to calculate the value for a guide. Each formula has a certain number of arguments and a specific set of operations to perform on these arguments in order to generate a value for a guide. There are a total of 17 different formulas available.
         */
        const fmla = node.attributes.fmla

        if (fmla && fmla.indexOf('val') == 0) {
            this.val = +fmla.replace('val ', '')
        }
    }
}

/**
 * This element specifies the adjust values that will be applied to the specified shape. An adjust value is simply a guide that has a value based formula specified. That is, no calculation takes place for an adjust value guide. Instead, this guide specifies a parameter value that is used for calculations within the shape guides.
 */
module.exports = class AvLst {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.gds = node.selectArray(['a:gd']).map(c => new Gd(c))
    }

    toJSON() {
        return this.gds.map(gd => {
            return {
                name: gd.name,
                val: gd.val
            }
        })
    }
}
