const XElement = require('./xelement')

const TextStyles = require('./components/text-styles')

const {createSp} = require('./components/ShapeTree')

const SlideBg = require("./components/elements/p-bg")

class SlideMasterXML {
    constructor(xml) {
        this.xml = XElement.init(xml)

        this.textStyles = new TextStyles(this.xml.getSingle("p:txStyles"))

        this.shapes = this.xml.selectArray(['p:cSld', 'p:spTree','p:sp']).map(sp=>createSp(sp))

        let bg = this.xml.selectFirst(['p:cSld',"p:bg"])

        if(bg){
            this.bg = new SlideBg(bg)
        }

        this.typeMap = {
            title:"title",
            subTitle:"body",
            ctrTitle:"title"
        }
        
        this.clrMap = {}

        let clrMap = this.xml.getSingle("p:clrMap")

        if(clrMap){
            Object.keys(clrMap.attributes).map(k=>{
                this.clrMap[k] = clrMap.attributes[k]
            })
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

    getBulletColorOfType(type){
        let txBody = this.getTxBodyOfType(type)
        if(txBody && txBody.textStyle){
            return txBody.textStyle.getBulletColor('0')
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
     * schemeClr的映射
     * @returns {string}
     */
    findSchemeClr(k){
        return this.clrMap[k]
    }


}

module.exports = SlideMasterXML