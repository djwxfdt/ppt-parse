const XElement = require('../../xelement')

const LnSpc = require('./a-lnSpc')

/**
 * This element specifies the amount of vertical white space that will be present before a paragraph. This space is specified in either percentage or points via the child elements <spcPct> and <spcPts>.
 */
class SpecBef {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        let spcPct = node.getSingle('a:spcPct')
        if (spcPct && spcPct.attributes.val) {
            this.spcPct = +spcPct.attributes.val / 1000
        }

        let spcPts = node.getSingle('a:spcPts')
        if (spcPts && spcPts.attributes.val) {
            this.spcPts = (+spcPts.attributes.val / 100 / 3) * 4
        }
    }
}

module.exports = class PPr {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        /**
         * Specifies the particular level text properties that this paragraph will follow. The value for this attribute is numerical and formats the text according to the corresponding level paragraph properties that are listed within the <lstStyle> element. Since there are nine separate level properties defined, this tag will have an effective range of 0-8 = 9 available values.
         */
        this.lvl = node.attributes.lvl

        let lnSpc = node.getSingle('a:lnSpc')

        if (lnSpc) {
            this.lnSpc = new LnSpc(lnSpc)
        }

        let spcBef = node.getSingle('a:spcBef')
        if (spcBef) {
            this.spcBef = new SpecBef(spcBef)
        }

        this.buNone = !!node.getSingle('a:buNone')

        let buChar = node.getSingle('a:buChar')
        if (buChar) {
            /**
             * This element specifies that a character be applied to a set of bullets. These bullets are allowed to be any character in any font that the system is able to support. If no bullet font is specified along with this element then the paragraph font will be used.
             * @type {string}
             */
            this.buChar = buChar.attributes.char
        }

        let buAutoNum = node.getSingle('a:buAutoNum')
        if (buAutoNum) {
            this.buChar = '-'
        }

        let buSzPts = node.getSingle('a:buSzPts')
        if (buSzPts && buSzPts.attributes.val) {
            this.buSzPts = (+buSzPts.attributes.val / 100 / 3) * 4
        }

        let buSzPct = node.getSingle('a:buSzPct')
        if (buSzPct && buSzPct.attributes.val) {
            this.buSzPct = +buSzPct.attributes.val / 1000
        }

        let buClr = node.selectFirst(['a:buClr', 'a:srgbClr'])
        if (buClr) {
            this.buClr = buClr.attributes.val
        }

        let buFont = node.getSingle('a:buFont')
        if (buFont) {
            this.buFont = buFont
        }

        /**
         * ctr:center
         * dist:Distributes the text words across an entire text line.
         * just:Align text so that it is justified across the whole line. It is smart in the sense that it will not justify sentences which are short.
         *
         * @type {"ctr"|"dist"|"just"|"l"|"r"|"justLow"}
         */
        this.algn = node.attributes.algn

        let marL = node.attributes.marL

        if (marL) {
            this.marL = Math.floor((+marL * 96) / 91440) / 10
        }

        let indent = node.attributes.indent
        if (indent) {
            this.indent = Math.floor((+indent * 96) / 91440) / 10
        }
    }

    get lineSpacePercent() {
        if (this.lnSpc) {
            return this.lnSpc.spcPct
        }
    }

    get lineSpacePix() {
        if (this.lnSpc) {
            return this.lnSpc.spcPts
        }
    }

    get spaceBefore() {
        if (this.spcBef) {
            return this.spcBef.spcPts
        }
    }

    toJSON() {
        return {
            spcBef: this.spaceBefore,
            // lnPct: this.lineSpacePercent,
            lnPx: this.lineSpacePix,
            algn: this.algn,
            marL: this.marL,
            indent: this.indent
        }
    }
}
