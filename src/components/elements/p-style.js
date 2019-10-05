const XElement = require('../../xelement')

const Color = require('./c-color')

class ColrRef extends Color {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        super(node)
        this.idx = node.attributes.idx
    }
}

module.exports = class Style {
    /**
     *
     * @param {XElement} node
     */
    constructor(node) {
        let fillRef = node.getSingle('a:fillRef')
        if (fillRef) {
            this.fillRef = new ColrRef(fillRef)
        }

        let lnRef = node.getSingle('a:lnRef')
        if (lnRef) {
            this.lnRef = new ColrRef(lnRef)
        }
    }
}
