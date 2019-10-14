const XElement = require('../../xelement')

class EmbeddedFont {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.name = this.getAttr(node.getSingle('p:font'), 'typeface')
        this.regular = this.getAttr(node.getSingle('p:regular'), 'r:id')
        this.bold = this.getAttr(node.getSingle('p:bold'), 'r:id')
        this.italic = this.getAttr(node.getSingle('p:italic'), 'r:id')
        this.boldItalic = this.getAttr(node.getSingle('p:boldItalic'), 'r:id')
    }

    /**
     * @param {XElement} node
     * @returns {string}
     */
    getAttr(node, name) {
        if (node || node.attributes) {
            return node.attributes[name]
        }
    }
}

module.exports = class EmbeddedFontLst {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        /**
         * @type {Array<XElement>}
         */
        let lst = node.get('p:embeddedFont') || []

        this._list = lst.map(l => new EmbeddedFont(l))
    }

    isEmebed(type) {
        return !!this._list.find(l => l.name == type)
    }

    get list() {
        return this._list || []
    }
}
