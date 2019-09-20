// const {searchXML} = require('./utils')

const XElement = require('./xelement')

const FontScheme = require('./components/elements/a-fontScheme')


class ThemeXML {
    constructor(xml) {
        
        this.xml = XElement.init(xml).selectFirst(["a:themeElements"]) 

        this.fontScheme = new FontScheme(this.xml.selectFirst(['a:fontScheme']))
    }

    getColor(rel){
        let val = this.xml.selectFirst(["a:clrScheme",rel])
        if(val){
            let srgbClr = val.getSingle('a:srgbClr')
            if(srgbClr){
                return srgbClr.attributes.val
            }

            let sysClr = val.getSingle('a:sysClr')
            if(sysClr){
                return sysClr.attributes.lastClr
            }

        }
    }
}


module.exports = ThemeXML