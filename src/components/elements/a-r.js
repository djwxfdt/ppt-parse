const RPr = require('./a-rpr')
const XElement = require('../../xelement')

module.exports = class R {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        let t = node.getSingle('a:t')

        if (t) {
            if (t.value) {
                this.text = t.value
            } else {
                this.text = (t.children[0] || {}).value
            }
        }

        if (node.getSingle('a:rPr')) {
            this.rPr = new RPr(node.getSingle('a:rPr'))
        }
    }

    get fontSize() {
        if (this.rPr) {
            return this.rPr.size
        }
    }

    get solidFill() {
        if (this.rPr) {
            return this.rPr.solidFill
        }
    }

    get fontFamlily() {
        if (this.rPr) {
            return this.rPr.typeface
        }
    }
}
