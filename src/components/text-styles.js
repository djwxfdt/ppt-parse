const XElement = require('../xelement')

const RPr = require('./elements/a-rpr')

const LnSpc = require('./elements/a-lnSpc')



class LvpPr{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        this.lvl = node.attributes.lvl
        this.marR = node.attributes.marR
        this.rtl = node.attributes.rtl
        this.algn = node.attributes.algn

        let defPPr = node.getSingle("a:defRPr")
        if(defPPr){
            this.defRpr = new RPr(defPPr)
        }

        let lnSpc = node.getSingle("a:lnSpc")
        if(lnSpc){
            this.lnSpc = new LnSpc(lnSpc)
        }

        let buClr = node.selectFirst(["a:buClr","a:srgbClr"])
        if(buClr){
            this.buClr = buClr.attributes.val
        }
    }

    get size(){
        if(this.defRpr){
            return this.defRpr.size
        }
    }

    get typeface(){
        if(this.defRpr){
            return this.defRpr.typeface
        }
    }

    /**
     * 文字颜色
     */
    get color(){
        if(this.defRpr){
            return this.defRpr.solidFill
        }
    }

    get lineSpacePercent(){
        if(this.lnSpc){
            return this.lnSpc.spcPct
        }
    }
}

class TextStyle{
     /**
     * @param {XElement} node 
     */
    constructor(node){

        /**
         * @type {{[key:string]:LvpPr}}
         */
        this.lvPprs = {
            
        }

        if(node.children.length == 0){
            this.isEmpty = true
        }else{
            node.children.map((ppr,index)=>{
                if(ppr.name.indexOf("a:lvl") > -1){
                     let lv = new LvpPr(ppr)
                     this.lvPprs[ppr.name.replace("a:","")] = lv
                     if(lv.lvl == undefined){
                         lv.lvl = index
                     }
                }
            })
        }

        
        // node.map((key,ppr)=>{
        //     this.lvPprs[key.replace("a:","")] = new LvpPr(ppr[0])
        // })

    }

    find(lvl){
        let keys = Object.keys(this.lvPprs)
        if( keys.length == 1){
            return this.lvPprs[keys[0]]
        }

        for(let key in this.lvPprs){
            if(key == "defPPr"){
                continue
            }
            let ppr = this.lvPprs[key]
            if(ppr.lvl == lvl){
                return ppr
            }
        }
    }

    getSize(lvl){
        let ppr = this.find(lvl)
        if(ppr && ppr.defRpr){
            return ppr.defRpr.size
        }
    }

    getColor(lvl){
        let ppr = this.find(lvl)
        if(ppr && ppr.defRpr){
            return ppr.defRpr.solidFill
        }
    }

    getBulletColor(lvl){
        let ppr = this.find(lvl)
        if(ppr){
            return ppr.buClr
        }
    }

    getTypeface(lvl){
        let ppr = this.find(lvl)
        if(ppr){
            return ppr.typeface
        }
    }

    /**
     * @param {"size"|"color"|"bullet"} type 
     * @param {*} lvl 
     */
    getValue(type,lvl){
        switch(type){
            case "size":{
                return this.getSize(lvl)
            }
            case "color":{
                return this.getColor(lvl)
            }
            case "bullet":{
                return this.getBulletColor(lvl)
            }
        }
    }
}


/**
 * This element specifies the text styles within a slide master. Within this element is the styling information for title text, the body text and other slide text as well. This element is only for use within the Slide Master and thus sets the text styles for the corresponding presentation slides.
 */
module.exports =  class TextStyles{

    /**
     * @param {XElement} node 
     */
    constructor(node){

        let title = node.getSingle('p:titleStyle')
        if(title){
            this.titleStyle = new TextStyle(title)
        }

        let body = node.getSingle('p:bodyStyle')
        if(body){
            this.bodyStyle = new TextStyle(body)
        }

        let other = node.getSingle('p:otherStyle')
        if(other){
            this.otherStyle = new TextStyle(other)
        }
    }

    /**
     * 
     * @param {*} type 
     * @param {*} lv 
     * @returns {number}
     */
    getTextSizeOfType(type,lv="0"){
        if(type == "title"){
            debugger
        }
        switch(type){
            case "title":
            case "subTitle":
            case "ctrTitle":{
                return this.titleStyle.getSize(lv)
            }
            case "body":{
                return this.bodyStyle.getSize(lv)
            }
            case "sldNum":
            case "dt":{
                return 12
            }
            default:{
                return this.otherStyle.getSize(lv)
            }
        }
    }
}

module.exports.TextStyle = TextStyle