const { TextStyle } = require('../text-styles')
const P = require('./a-p')
const XElement = require('../../xelement')

const BodyPr = require('./a-bodyPr')

module.exports = class TxBody {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.pList = node.selectArray(['a:p']).map(p => new P(p))

        const lstStyle = node.getSingle('a:lstStyle')
        if (lstStyle) {
            this.textStyle = new TextStyle(lstStyle)
            if (this.textStyle.isEmpty) {
                this.textStyle = null
            }
        }

        const bodyPr = node.getSingle('a:bodyPr')
        if (bodyPr) {
            this.bodyPr = new BodyPr(bodyPr)
            if (this.bodyPr.isEmpty) {
                this.bodyPr = null
            }
        }
    }

    get anchor() {
        if (this.bodyPr) {
            return this.bodyPr.anchor
        }
    }

    get padding() {
        return this.bodyPr && this.bodyPr.padding
    }
}
