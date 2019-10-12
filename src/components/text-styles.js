const XElement = require('../xelement')

const RPr = require('./elements/a-rpr')

const LnSpc = require('./elements/a-lnSpc')

class LvpPr {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.lvl = node.attributes.lvl
        this.marR = node.attributes.marR
        this.rtl = node.attributes.rtl
        this.algn = node.attributes.algn

        const defPPr = node.getSingle('a:defRPr')
        if (defPPr) {
            this.defRpr = new RPr(defPPr)
        }

        const lnSpc = node.getSingle('a:lnSpc')
        if (lnSpc) {
            this.lnSpc = new LnSpc(lnSpc)
        }

        this.buNone = !!node.getSingle('a:buNone')

        let buChar = node.getSingle('a:buChar')
        if (buChar) {
            /**
             * This element specifies that a character be applied to a set of bullets. These bullets are allowed to be any character in any font that the system is able to support. If no bullet font is specified along with this element then the paragraph font will be used.
             * @type {string}
             */
            this.buChar = buChar.attributes.char
        }

        let buAutoNum = node.getSingle('a:buAutoNum')
        if (buAutoNum) {
            this.buChar = '-'
        }

        let buSzPts = node.getSingle('a:buSzPts')
        if (buSzPts && buSzPts.attributes.val) {
            this.buSzPts = (+buSzPts.attributes.val / 100 / 3) * 4
        }

        let buSzPct = node.getSingle('a:buSzPct')
        if (buSzPct && buSzPct.attributes.val) {
            this.buSzPct = +buSzPct.attributes.val / 1000
        }

        let buClr = node.selectFirst(['a:buClr', 'a:srgbClr'])
        if (buClr) {
            this.buClr = buClr.attributes.val
        }

        let buFont = node.getSingle('a:buFont')
        if (buFont) {
            this.buFont = buFont
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
