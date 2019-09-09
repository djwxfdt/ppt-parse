const XElement = require('../xelement')

const Sp = require('./elements/p-sp')

const Pic = require('./elements/p-pic')

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