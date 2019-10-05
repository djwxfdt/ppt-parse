const XElement = require('../../xelement')

const Color = require('./c-color')

const { EMU2PIX, Angle2Degree } = require('../measure')

class OuterShdw extends Color {
    /**
     *
     * @param {XElement} node
     */
    constructor(node) {
        super(node)

        this.dir = Angle2Degree(node.attributes.dir || 0)

        this.blurRad = EMU2PIX(node.attributes.blurRad || 0)

        this.dist = EMU2PIX(node.attributes.dist || 0)
    }
}

class Reflection {
    /**
     *
     * @param {XElement} node
     */
    constructor(node) {
        this.dir = +(node.attributes.dir || 0) / 60000
    }
}

module.exports = class EffectLst {
    /**
     *
     * @param {XElement} node
     */
    constructor(node) {
        const outerShaw = node.getSingle('a:outerShdw')

        if (outerShaw) {
            this.outerShaw = new OuterShdw(outerShaw)
        }

        const reflection = node.getSingle('a:reflection')
        if (reflection) {
            this.reflection = new Reflection(reflection)
        }
    }
}
