const XElement = require('../../xelement')

const Sp = require('./p-sp')

const Pic = require('./p-pic')

const Xfrm = require('./a-xfrm')
 
module.exports = class GroupShape{

    /**
     * @param {XElement} node 
     */
    constructor(node){
        this.shapes = node.selectArray(["p:sp"]).map(n=>new Sp(n))

        this.pics = node.selectArray(["p:pic"]).map(n=>new Pic(n))

        this.groupShapes = node.selectArray(["p:grpSp"]).map(n=>new GroupShape(n))

        let xfrm = node.selectFirst(["p:grpSpPr","a:xfrm"])

        if(xfrm){
            this.xfrm = new Xfrm(xfrm)
        }
    }
}