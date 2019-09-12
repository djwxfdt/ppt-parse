const Xfrm = require('./a-xfrm')
const XElement = require('../../xelement')

const CustGeom = require("./a-custGeom")

module.exports = class SpPr {
    /**
    * @param {XElement} node 
    */
    constructor(node) {


        let xfrm = node.getSingle("a:xfrm")

        if (xfrm) {
            /**
             * This element represents 2-D transforms for ordinary shapes
             */
            this.xfrm = new Xfrm(xfrm)
        }

        let custGeom = node.getSingle("a:custGeom")
        if (custGeom) {
            this.custGeom = new CustGeom(custGeom)
        }

        if (node.getSingle("a:solidFill")) {
            this.solidFill = node.selectFirst(["a:solidFill", "a:srgbClr"]).attributes.val || node.selectFirst(["a:solidFill", "a:schemeClr"]).attributes.val
        }
    }
}