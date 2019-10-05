const XElement = require('../xelement')

const Sp = require('./elements/p-sp')

const Pic = require('./elements/p-pic')

const GroupShape = require('./elements/p-grpSp')

const GraphicFrame = require('./elements/p-graphicFrame')

/**
 * @param {XElement} node
 * @returns {Sp}
 */
module.exports.createSp = (node) => {
    return new Sp(node)
}

/**
 * @param {XElement} node
 * @returns {Pic}
 */
module.exports.createPic = node => {
    return new Pic(node)
}

module.exports.createGroupSp = node => {
    return new GroupShape(node)
}

/**
 * @param {XElement} node
 */
module.exports.createElement = node => {
    switch (node.name) {
    case 'p:sp': {
        return new Sp(node)
    }
    case 'p:cxnSp': {
        return new Sp(node)
    }
    case 'p:pic': {
        return new Pic(node)
    }
    case 'p:grpSp': {
        return new GroupShape(node)
    }
    case 'p:graphicFrame': {
        return new GraphicFrame(node)
    }
    }
}
