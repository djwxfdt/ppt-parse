const XElement = require('../xelement')

const Sp = require('./elements/p-sp')

const Pic = require('./elements/p-pic')

const GroupShape = require("./elements/p-grpSp")

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