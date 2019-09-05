// const {searchXML} = require('./utils')

const XElement = require('./xelement')


class ThemeXML {
    constructor(xml) {
        
        this.xml = XElement.init(xml).selectFirst(["a:theme","a:themeElements"]) 
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

    getFontFamily(type){
        let fontSchemeNode = this.xml.selectFirst(['a:fontScheme'])
        if(!fontSchemeNode){
            return
        }
        switch(type){
            case "title":
            case "subTitle":
            case "ctrTitle":{
                return fontSchemeNode.selectFirst(['a:majorFont', 'a:latin', 'attrs', 'typeface'])
            }
            case "body":
            default:{
                return fontSchemeNode.selectFirst(['a:minorFont', 'a:latin', 'attrs', 'typeface'])
            }
        }
    }

    /**
     * 
     * @param {string} theme 
     */
    getFontTheme(theme){
        let fontSchemeNode = this.xml.selectFirst(['a:fontScheme'])
        if(!fontSchemeNode){
            return
        }

        switch(theme){
            case "+mj-ea":{
                return fontSchemeNode.selectFirst(['a:majorFont', 'a:ea', 'attrs', 'typeface'])
            }
            case "+mn-ea":{
                return fontSchemeNode.selectFirst(['a:minorFont', 'a:ea', 'attrs', 'typeface'])
            }
            case "+mj-lt":{
                return fontSchemeNode.selectFirst(['a:majorFont', 'a:latin', 'attrs', 'typeface'])
            }
            case "+mn-lt":
            default:
            {
                return fontSchemeNode.selectFirst(['a:minorFont', 'a:latin', 'attrs', 'typeface'])
            }

        }
    }
}


module.exports = ThemeXML