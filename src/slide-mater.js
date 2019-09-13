const XElement = require('./xelement')

const TextStyles = require('./components/text-styles')

const {createSp} = require('./components/ShapeTree')

class SlideMasterXML {
    constructor(xml) {
        this.xml = XElement.init(xml).get("p:sldMaster")

        this.textStyles = new TextStyles(this.xml.getSingle("p:txStyles"))

        this.shapes = this.xml.selectArray(['p:cSld', 'p:spTree','p:sp']).map(sp=>createSp(sp))

        this.typeMap = {
            title:"title",
            subTitle:"body",
            ctrTitle:"title"
        }

    }

    get titleColor(){
        let titleSp = this.shapes.find(sp=>sp.type == "title")
        if(titleSp && titleSp.txBody && titleSp.txBody.textStyle){
            return titleSp.txBody.textStyle.getColor('0')
        }
    }
    
    get titleSize(){
        let finded = this.shapes.find(sp=>sp.type == "title")
        if(finded && finded.txBody  && finded.txBody.textStyle){
            let style = finded.txBody.textStyle.find('0')
            if(style){
                return style.size
            }
        }
    }

    getTxBodyOfType(type){
        if(!type){
            return
        }
        type = this.typeMap[type] || type
        let finded = this.shapes.find(sp=>sp.type == type)
        if(finded && finded.txBody){
            return finded.txBody
        }
    }

    getTxStyleOfType(type){
        if(!type){
            return
        }
        type = this.typeMap[type] || type
        let finded = this.shapes.find(sp=>sp.type == type)
        let style = finded && finded.txBody && finded.txBody.textStyle
        if(!style){
            switch(type){
                case "title":{
                    return this.textStyles.titleStyle
                }
                case "body":{
                    return this.textStyles.bodyStyle
                }
                case "other":{
                    return this.textStyles.bodyStyle
                }
            } 
        }
        return style
    }

    getTextColorOfType(type){
        let txBody = this.getTxBodyOfType(type)
        if(txBody && txBody.textStyle){
            return txBody.textStyle.getColor('0')
        }
    }

    

    getTextSizeOfType(type){
        let style = this.getTxStyleOfType(type)
        if(style){
            return style.getSize('0')
        }
    }

    getLineSpacePercent(type){
        let txBody = this.getTxBodyOfType(type)
        if(txBody && txBody.textStyle){
            let style = txBody.textStyle.find('0')
            if(style){
                return style.lineSpacePercent
            }
        }
    }

    /**
     * @param {ThemeXML} themeXml 
     */
    getBackground(themeXml) {
        let bgPr = this.xml.selectFirst(['p:cSld', 'p:bg', 'p:bgPr'])
        let bgRef = this.xml.selectFirst(['p:cSld', 'p:bg', 'p:bgRef'])
        let bgColor = null

        if (bgPr) {

        } else if (bgRef) {

            let phCl = bgRef.selectFirst(['a:srgbClr', 'a:srgbClr', 'attrs', 'val'])
            if (!phCl) {
                let c = bgRef.selectFirst(['a:schemeClr', 'attrs', 'val'])
                let theme = "a:" + bgRef.selectFirst(['p:clrMap', 'attrs',c]) 
                bgColor = themeXml.getColor(theme)
            }

            let idx = bgRef.selectFirst(["attrs", "idx"])
            if (+idx > 1000) {
                // console.log('bgColor:', bgColor)
            } else {
                bgColor = null
            }
        }
        return bgColor

    }


    get tables() {
        if (this._tables) {
            return this._tables
        }

        /**
         * @type {{[key:string]:XElement}}
         */
        let idTable = {}
        /**
         * @type {{[key:string]:XElement}}
         */
        let idxTable = {}
        /**
         * @type {{[key:string]:XElement}}
         */
        let typeTable = {}

        this._tables = {idTable,idxTable,typeTable}
        return this._tables
    }


}

module.exports = SlideMasterXML