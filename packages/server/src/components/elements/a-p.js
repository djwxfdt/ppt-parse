const R = require('./a-r')
const XElement = require('../../xelement')

const PPr = require('./a-pPr')
const Fld = require('./a-fld')

module.exports = class P {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.rList = node.selectArray(['a:r']).map(r => new R(r))

        let pPr = node.getSingle('a:pPr')

        if (pPr) {
            this.pPr = new PPr(pPr)
        }

        let fld = node.getSingle('a:fld')
        if (fld) {
            this.fld = new Fld(fld)
        }
    }

    get lineSpacePercent() {
        if (this.pPr) {
            return this.pPr.lineSpacePercent
        }
    }

    get lineSpacePix() {
        return this.pPr && this.pPr.lineSpacePix
    }

    get spaceBofore() {
        if (this.pPr) {
            return this.pPr.spaceBefore
        }
    }

    get hasBullet() {
        return this.pPr && !this.pPr.buNone && !!this.pPr.buChar
    }

    get bullet() {
        if (this.pPr && !this.pPr.buNone) {
            return {
                char: this.pPr.buChar,
                sz: this.pPr.buSzPts,
                color: this.pPr.buClr
            }
        }
    }

    get bullNone() {
        return this.pPr && this.pPr.buNone
    }

    get isSlideNum() {
        return this.fld && this.fld.isSlideNum
    }

    get align() {
        return this.pPr && this.pPr.algn
    }

    get lvl() {
        return (this.pPr && this.pPr.lvl)
    }
}
