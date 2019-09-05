const XElement = require('../xelement')

class SpElement{

}

class NvGrpSpPr extends SpElement{

}

class Sp extends SpElement{
    /**
     * 
     * @param {XElement} node 
     */
    constructor(node){
        this.name = "p:sp"

        this._node = node

        
    }

    get spPr(){

    }
}

/**
 * 
 * @param {XElement} node 
 * @returns {Sp}
 */
module.exports.createSp = (node)=>{
    return new Sp(node)
} 

