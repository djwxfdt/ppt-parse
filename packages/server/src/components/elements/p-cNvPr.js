module.exports = class CNvPr {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.id = node.attributes.id
        this.name = node.attributes.name
    }
}
