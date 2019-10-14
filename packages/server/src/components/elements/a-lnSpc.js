const XElement = require('../../xelement')

module.exports = class LnSpc {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        const spcPct = node.getSingle('a:spcPct')
        if (spcPct && spcPct.attributes.val) {
            /**
             * This element specifies the amount of white space that is to be used between lines and paragraphs in the form of a percentage of the text size. The text size that is used to calculate the spacing here is the text for each run, with the largest text size having precedence. That is if there is a run of text with 10 point font and within the same paragraph on the same line there is a run of text with a 12 point font size then the 12 point should be used to calculate the spacing to be used.
             */
            this.spcPct = +spcPct.attributes.val / 1000
        }

        const spcPts = node.getSingle('a:spcPts')
        if (spcPts && spcPts.attributes.val) {
            this.spcPts = +spcPts.attributes.val / 100
        }
    }
}
