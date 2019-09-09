// const {searchXML} = require('./utils')

const XElement = require('./xelement')

const FontScheme = require('./components/elements/a-fontScheme')


class ThemeXML {
    constructor(xml) {
        
        this.xml = XElement.init(xml).selectFirst(["a:theme","a:themeElements"]) 

        this.fontScheme = new FontScheme(this.xml.selectFirst(['a:fontScheme']))
    }

    getColor(rel){
        let val = this.xml.selectFirst(["a:clrScheme",rel])
        if(val){
            let color =  val.selectFirst(['a:srgbClr', 'attrs', 'val'])
            if(!color){
                color = val.selectFirst(['a:sysClr', 'attrs', 'lastClr'])
            }
            return color
        }
    }

}


module.exports = ThemeXML