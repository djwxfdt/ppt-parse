const XElement = require('../../xelement')

const SolidFill = require('./a-solidFill')

const GradFill = require('./a-gradFill')

module.exports = class FillStyleLst {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.list = node.children.map(c => {
            switch (c.name) {
            case 'a:solidFill': {
                return new SolidFill(c)
            }
            case 'a:gradFill': {
                return new GradFill(c)
            }
            }
        })
    }
}
