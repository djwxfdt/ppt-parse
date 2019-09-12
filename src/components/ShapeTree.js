const XElement = require('../xelement')

const Sp = require('./elements/p-sp')

const Pic = require('./elements/p-pic')

const Xfrm = require('./elements/a-xfrm')

class GroupShape{

    /**
     * @param {XElement} node 
     */
    constructor(node){
        this.shapes = node.selectArray(["p:sp"]).map(n=>new Sp(n))

        let xfrm = node.selectFirst(["p:grpSpPr","a:xfrm"])

        if(xfrm){
            this.xfrm = new Xfrm(xfrm)
        }
    }
}

/**
 * @param {XElement} node 
 * @returns {Sp}
 */
module.exports.createSp = (node)=>{
    return new Sp(node)
} 


/**
 * @param {XElement} node 
 * @returns {Pic}
 */
module.exports.createPic = node =>{
    return new Pic(node)
}

module.exports.createGroupSp = node =>{
    return new GroupShape(node)
}