const XElement = require('../../xelement')

const Color = require("./c-color")


class FillRef extends Color{

    /**
     * @param {XElement} node 
     */
    constructor(node){
        super(node)
        this.idx = node.attributes.idx
    }
}

module.exports = class Style{
    /**
     * 
     * @param {XElement} node 
     */
    constructor(node){

        let fillRef = node.getSingle("a:fillRef")
        if(fillRef){
            this.fillRef = new FillRef(fillRef)
        }
    }
}