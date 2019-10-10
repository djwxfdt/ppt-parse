const XElement = require('../../xelement')

// const {searchXML} = require("../../utils")

class Path {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.height = (+node.attributes.h / 100 / 3) * 4

        this.width = (+node.attributes.w / 100 / 3) * 4

        this.actions = node.children.map(c => {
            const t = c.name.replace('a:', '')
            const pts = c.selectArray(['a:pt'])

            /**
             * @type {{t:string,x:number,y:number,pts:Array}}
             */
            const r = { t, pts: [] }

            if (pts.length == 1) {
                const attrs = pts[0].attributes
                r.x = Math.floor((+attrs.x / 100 / 3) * 4)
                r.y = Math.floor((+attrs.y / 100 / 3) * 4)
            }

            pts.map(pt => {
                r.pts.push({
                    x: Math.floor((+pt.attributes.x / 100 / 3) * 4),
                    y: Math.floor((+pt.attributes.y / 100 / 3) * 4)
                })
            })

            return r
        })
    }
}

/**
 * This element specifies the existence of a custom geometric shape. This shape will consist of a series of lines and curves described within a creation path. In addition to this there may also be adjust values, guides, adjust handles, connection sites and an inscribed rectangle specified for this custom geometric shape.
 */
module.exports = class CustGeom {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        const list = node.selectArray(['a:pathLst', 'a:path']) || []

        this.pathList = list.map(l => new Path(l))
    }

    get paths() {
        return this.pathList.map(p => {
            return {
                height: p.height,
                width: p.width,
                points: p.actions
            }
        })
    }
}
