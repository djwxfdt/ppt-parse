const XElement = require('./xelement')

const TextStyles = require('./components/text-styles')

const SlideBg = require("./components/elements/p-bg")

const Transition = require("./components/elements/p-transition")

const ShapeTree = require('./components/ShapeTree')

const BaseSlide = require("./base-slide")


class SlideMasterXML extends BaseSlide {
    constructor(xml) {
        super(xml)


        this.type = "master"

        this.textStyles = new TextStyles(this.xml.getSingle("p:txStyles"))

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

    getPlaceholder(idx,type){
        type = this.typeMap[type] || type
        return super.getPlaceholder(null,type)
    }

    getTitleColor(){
        let style = this.getTxStyle({type:"title"})
        if(style){
            return style.getColor('0')
        }
    }

    getTxBodyOfType(type){
        if(!type){
            return
        }
        type = this.typeMap[type] || type
        let finded = this.placeholders.find(sp=>sp.type == type)
        if(finded && finded.txBody){
            return finded.txBody
        }
    }

    
  
    getTxStyle({type,idx}){
        type = this.typeMap[type] || type
        idx = null
        let style = super.getTxStyle({type,idx})

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

    getTextFontOfType(type){
        let style = this.getTxStyle({type})
        if(style){
            return style.getTypeface('0')
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