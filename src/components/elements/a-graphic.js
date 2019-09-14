const XElement = require("../../xelement")

class Table{
    /**
     * @param {XElement} node
     */
    constructor(node) {
    }
}

class GraphicData {
    /**
     * @param {XElement} node
     */
    constructor(node) {
      
        /**
         * Specifies the URI, or uniform resource identifier that represents the data stored under this tag. The URI is used to identify the correct 'server' that can process the contents of this tag.
         */
        this.uri = node.attributes.uri

        let table = node.getSingle("a:tbl")
        if(table){
            this.table = new Table(table)
            this.type = "table"
        }

    }
}

module.exports = class Graphic {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        let gData = node.getSingle("a:graphicData")
        if(gData){
            this.graphicData = new GraphicData(gData)
        }
    }
};
