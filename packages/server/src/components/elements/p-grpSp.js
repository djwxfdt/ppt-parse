const XElement = require('../../xelement')

const Sp = require('./p-sp')

const Pic = require('./p-pic')

const GraphicFrame = require('./p-graphicFrame')

const Xfrm = require('./a-xfrm')

module.exports = class GroupShape {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.tag = 'p:grpSp'

        // this.shapes = node.selectArray(["p:sp"]).map(n=>new Sp(n))

        // this.pics = node.selectArray(["p:pic"]).map(n=>new Pic(n))

        // this.groupShapes = node.selectArray(["p:grpSp"]).map(n=>new GroupShape(n))

        this.elements = node.children
            .map(sp => {
                switch (sp.name) {
                case 'p:sp': {
                    return new Sp(sp)
                }
                case 'p:pic': {
                    return new Pic(sp)
                }
                case 'p:grpSp': {
                    return new GroupShape(sp)
                }
                case 'p:graphicFrame': {
                    return new GraphicFrame(sp)
                }
                }
            })
            .filter(i => !!i)

        // case "p:graphicFrame":{
        //     return new GraphicFrame(node)
        // }

        let xfrm = node.selectFirst(['p:grpSpPr', 'a:xfrm'])

        if (xfrm) {
            this.xfrm = new Xfrm(xfrm)
        }
    }
}
