// const {searchXML} = require('./utils')

const XElement = require('./xelement')

const FontScheme = require('./components/elements/a-fontScheme')

const FillStyleLst = require('./components/elements/a-fillStyleLst')

class ThemeXML {
    constructor(xml) {
        this.xml = XElement.init(xml).selectFirst(['a:themeElements'])

        this.fontScheme = new FontScheme(this.xml.selectFirst(['a:fontScheme']))

        const fillStyleLst = this.xml.selectFirst([
            'a:fmtScheme',
            'a:fillStyleLst'
        ])
        if (fillStyleLst) {
            this.fillStyleLst = new FillStyleLst(fillStyleLst)
        }

        const bgFillStyleLst = this.xml.selectFirst([
            'a:fmtScheme',
            'a:bgFillStyleLst'
        ])
        if (bgFillStyleLst) {
            this.bgFillStyleLst = new FillStyleLst(bgFillStyleLst)
        }
    }

    getColor(rel) {
        const val = this.xml.selectFirst(['a:clrScheme', rel])
        if (val) {
            const srgbClr = val.getSingle('a:srgbClr')
            if (srgbClr) {
                return srgbClr.attributes.val
            }

            const sysClr = val.getSingle('a:sysClr')
            if (sysClr) {
                return sysClr.attributes.lastClr
            }
        }
    }

    getBgFillByIdx(idx = 0) {
        if (idx == 0 || idx == 1000) {
            return
        }
        if (idx < 1000 && this.fillStyleLst) {
            return this.fillStyleLst.list[idx - 1]
        } else if (idx > 1000 && this.bgFillStyleLst) {
            return this.bgFillStyleLst.list[idx - 1000 - 1]
        }
    }
}

module.exports = ThemeXML
