const Xfrm = require('./a-xfrm')
const XElement = require('../../xelement')

const CustGeom = require("./a-custGeom")

const SolidFill = require("./a-solidFill")

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

        let solidFill = node.getSingle("a:solidFill")

        if (solidFill) {
            this.solidFill = new SolidFill(solidFill)
            // this.solidFill = node.selectFirst(["a:solidFill", "a:srgbClr"]).attributes.val || node.selectFirst(["a:solidFill", "a:schemeClr"]).attributes.val
        }

        let prstGeom = node.getSingle("a:prstGeom")
        if(prstGeom){
            /**
             * This element specifies when a preset geometric shape should be used instead of a custom geometric shape. The generating application should be able to render all preset geometries enumerated in the <ST_ShapeType> list.
             */
            this.prstGeom = prstGeom.attributes.prst
        }
    }
}