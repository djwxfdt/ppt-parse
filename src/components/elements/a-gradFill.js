const XElement = require('../../xelement')

const Color = require('./c-color')

/**
 * This element defines a gradient stop. A gradient stop consists of a position where the stop appears in the color band.
 */
class Gs extends Color {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        super(node)

        /**
         * Specifies where this gradient stop should appear in the color band. This position is specified in the range [0%, 100%], which corresponds to the beginning and the end of the color band respectively.
         */
        this.pos = +(node.attributes.pos || 0) / 1000
    }
}

/**
 * The list of gradient stops that specifies the gradient colors and their relative positions in the color band.
 */
class GsLst {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.gs = node.selectArray(['a:gs']).map(c => new Gs(c))
    }
}

module.exports = class GradFill {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.fillType = 'grad'

        const gsLst = node.getSingle('a:gsLst')

        if (gsLst) {
            this.gsLst = new GsLst(gsLst)
        }

        this.ang = 0

        const lin = node.getSingle('a:lin')
        if (lin) {
            this.ang = +(lin.attributes.ang || 0) / 60000
        }
    }

    /**
     * @returns {Array<Gs>}
     */
    get list() {
        if (this.gsLst) {
            return this.gsLst.gs.map(g => {
                return g
            })
        }
        return []
    }
}
