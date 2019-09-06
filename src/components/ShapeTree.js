const XElement = require('../xelement')

const Sp = require('./elements/p:sp')

class SpElement{

}

class NvGrpSpPr extends SpElement{

}


class Pic extends SpElement{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        this.name = "p:pic"
        
        let spPr = node.selectFirst(["spPr"])
        if(spPr){
            this.spPr = new SpPr(spPr)
        }
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

/**
 * @param {XElement} node 
 * @returns {Sp}
 */
module.exports.createPic = node =>{

}