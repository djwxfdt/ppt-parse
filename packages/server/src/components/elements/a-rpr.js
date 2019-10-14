const XElement = require('../../xelement')

const SolidFill = require('./a-solidFill')

const EffectLst = require('./a-effectLst')

module.exports = class RPr {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.size = node.attributes.sz

        if (!isNaN(this.size)) {
            /**
             * Specifies the size of text within a text run. Whole points are specified in increments of 100 starting with 100 being a point size of 1. For instance a font point size of 12 would be 1200 and a font point size of 12.5 would be 1250. If this attribute is omitted, than the value in <defRPr> should be used.
             */
            this.size = (+this.size / 100 / 3) * 4
        }

        /**
         * Specifies whether a run of text will be formatted as bold text. If this attribute is omitted, than a value of 0, or false is assumed.
         */
        this.bold = node.attributes.b == '1'

        /**
         * Specifies whether a run of text will be formatted as italic text. If this attribute is omitted, than a value of 0, or false is assumed.
         */
        this.italic = node.attributes.i == '1'

        /**
         * Specifies whether a run of text will be formatted as strikethrough text. If this attribute is omitted, than no strikethrough is assumed.
         */
        this.strike = node.attributes.strike

        let solidFill = node.getSingle('a:solidFill')

        if (solidFill) {
            this.solidFill = new SolidFill(solidFill)
        }

        /**
         * Specifies the baseline for both the superscript and subscript fonts. The size is specified using a percentage where 1000 is equal to 1 percent of the font size and 100000 is equal to 100 percent font of the font size
         */
        this.baseline = node.attributes.baseline
        if (this.baseline) {
            this.baseline = +this.baseline / 1000
        }

        if (node.getSingle('a:latin')) {
            /**
             * This element specifies that a Latin font be used for a specific run of text. This font will be specified with a typeface attribute much like the others but will specifically be classified as a Latin font.
             */
            this.typeface = node.getSingle('a:latin').attributes.typeface
        }

        this.underline = node.attributes.u

        if (this.underline == 'none') {
            this.underline = null
        }
        if (this.underline) {
            // console.log(this.underline)
        }

        let hilink = node.getSingle('a:hlinkClick')
        if (hilink) {
            this.link = {
                href: hilink.attributes['r:id'],
                tooltip: hilink.attributes.tooltip
            }
        }

        let highlight = node.getSingle('a:highlight')
        if (highlight) {
            /**
             * This element specifies the highlight color that will be present for a run of text.
             */
            this.highlight = new SolidFill(highlight)
        }

        let effectLst = node.getSingle('a:effectLst')
        if (effectLst) {
            this.effectLst = new EffectLst(effectLst)
        }
    }

    toJSON() {
        return {
            solidFill: this.solidFill,
            size: this.size,
            typeface: this.typeface
        }
    }
}
