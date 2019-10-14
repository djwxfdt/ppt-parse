const XElement = require('../../xelement')

const Color = require('./c-color')

module.exports = class SolidFill extends Color {
    constructor(n) {
        super(n)

        this.fillType = 'solid'
    }
}
