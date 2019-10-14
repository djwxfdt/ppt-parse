const XElement = require('../xelement')

const RPr = require('./elements/a-rpr')

const PPr = require('./elements/a-pPr')

class LvpPr extends PPr {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        super(node)

        const defRPr = node.getSingle('a:defRPr')
        if (defRPr) {
            this.defRpr = new RPr(defRPr)
        }
    }

    get size() {
        if (this.defRpr) {
            return this.defRpr.size
        }
    }

    get typeface() {
        if (this.defRpr) {
            return this.defRpr.typeface
        }
    }

    get bullet() {
        if (!this.buNone) {
            return {
                char: this.buChar,
                sz: this.buSzPts,
                color: this.buClr
            }
        }
    }

    /**
     * 文字颜色
     */
    get color() {
        if (this.defRpr) {
            return this.defRpr.solidFill
        }
    }

    get lineSpacePercent() {
        if (this.lnSpc) {
            return this.lnSpc.spcPct
        }
    }
}

class TextStyle {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        /**
         * @type {{[key:string]:LvpPr}}
         */
        this.lvPprs = {

        }

        if (node.children.length == 0) {
            this.isEmpty = true
        } else {
            node.children.map((ppr, index) => {
                if (ppr.name.indexOf('a:lvl') > -1) {
                    const lv = new LvpPr(ppr)
                    this.lvPprs[ppr.name.replace('a:', '')] = lv
                    if (lv.lvl == undefined) {
                        lv.lvl = index
                    }
                }
            })
        }

        // node.map((key,ppr)=>{
        //     this.lvPprs[key.replace("a:","")] = new LvpPr(ppr[0])
        // })
    }

    find(lvl) {
        const keys = Object.keys(this.lvPprs)
        if (keys.length == 1) {
            return this.lvPprs[keys[0]]
        }

        for (const key in this.lvPprs) {
            if (key == 'defPPr') {
                continue
            }
            const ppr = this.lvPprs[key]
            if (ppr.lvl == lvl) {
                return ppr
            }
        }
    }

    getSize(lvl) {
        const ppr = this.find(lvl)
        if (ppr && ppr.defRpr) {
            return ppr.defRpr.size
        }
    }

    getColor(lvl) {
        const ppr = this.find(lvl)
        if (ppr && ppr.defRpr) {
            return ppr.defRpr.solidFill
        }
    }

    getBullet(lvl) {
        const ppr = this.find(lvl)
        if (ppr) {
            return ppr.bullet
        }
    }

    getTypeface(lvl) {
        const ppr = this.find(lvl)
        if (ppr) {
            return ppr.typeface
        }
    }

    /**
     * @param {"size"|"color"|"bullet"} type
     * @param {*} lvl
     */
    getValue(type, lvl) {
        switch (type) {
        case 'size': {
            return this.getSize(lvl)
        }
        case 'color': {
            return this.getColor(lvl)
        }
        case 'bullet': {
            return this.getBulletColor(lvl)
        }
        case 'typeface': {
            return this.getTypeface(lvl)
        }
        }
    }
}

/**
 * This element specifies the text styles within a slide master. Within this element is the styling information for title text, the body text and other slide text as well. This element is only for use within the Slide Master and thus sets the text styles for the corresponding presentation slides.
 */
module.exports = class TextStyles {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        const title = node.getSingle('p:titleStyle')
        if (title) {
            this.titleStyle = new TextStyle(title)
        }

        const body = node.getSingle('p:bodyStyle')
        if (body) {
            this.bodyStyle = new TextStyle(body)
        }

        const other = node.getSingle('p:otherStyle')
        if (other) {
            this.otherStyle = new TextStyle(other)
        }
    }

    /**
     *
     * @param {*} type
     * @param {*} lv
     * @returns {number}
     */
    getTextSizeOfType(type, lv = '0') {
        switch (type) {
        case 'title':
        case 'subTitle':
        case 'ctrTitle': {
            return this.titleStyle.getSize(lv)
        }
        case 'body': {
            return this.bodyStyle.getSize(lv)
        }
        case 'sldNum':
        case 'dt': {
            return 12
        }
        default: {
            return this.otherStyle.getSize(lv)
        }
        }
    }
}

module.exports.TextStyle = TextStyle
