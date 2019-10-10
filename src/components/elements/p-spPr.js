const Xfrm = require('./a-xfrm')
const XElement = require('../../xelement')

const CustGeom = require('./a-custGeom')

const SolidFill = require('./a-solidFill')

const Ln = require('./a-ln')

const AvLst = require('./a-avLst')

const GradFill = require('./a-gradFill')

module.exports = class SpPr {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        let xfrm = node.getSingle('a:xfrm')

        if (xfrm) {
            /**
             * This element represents 2-D transforms for ordinary shapes
             */
            this.xfrm = new Xfrm(xfrm)
        }

        let custGeom = node.getSingle('a:custGeom')
        if (custGeom) {
            this.custGeom = new CustGeom(custGeom)
        }

        let solidFill = node.getSingle('a:solidFill')

        if (solidFill) {
            this.solidFill = new SolidFill(solidFill)
        }

        let gradFill = node.getSingle('a:gradFill')
        if (gradFill) {
            this.gradFill = new GradFill(gradFill)
        }

        let prstGeom = node.getSingle('a:prstGeom')
        if (prstGeom) {
            /**
             * This element specifies when a preset geometric shape should be used instead of a custom geometric shape. The generating application should be able to render all preset geometries enumerated in the <ST_ShapeType> list.
             * @type {"round2SameRect"|"rect"|"pie"|"blockArc"}
             */
            this.prstGeomType = prstGeom.attributes.prst

            let avLst = prstGeom.getSingle('a:avLst')
            if (avLst) {
                this.avLst = new AvLst(avLst)
            }
        }

        let ln = node.getSingle('a:ln')
        if (ln) {
            this.ln = new Ln(ln)
        }

        this.noFill = !!node.getSingle('a:noFill')
    }

    get prstGeom() {
        if (!this.prstGeomType) {
            return
        }

        let item = {
            type: this.prstGeomType
        }

        let pM = {
            pie: 1,
            roundRect: 1,
            blockArc: 1,
            arc: 1
        }

        if (pM[item.type] && this.avLst) {
            item.avLst = this.avLst.gds.map(gd => {
                return Math.round(+gd.val / 60000)
            })
        }
        return item
    }
}
