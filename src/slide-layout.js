const XElement = require('./xelement')

const ShapeTree = require('./components/ShapeTree')

const SlideBg = require("./components/elements/p-bg")

class SlideLayoutXML {
    constructor(xml) {
        this.xml = XElement.init(xml)

        let spTree = this.xml.selectFirst(['p:cSld', 'p:spTree'])

        this.elements = spTree.children.map(el=>ShapeTree.createElement(el)).filter(e=>!!e)

        this.placeholders = this.elements.filter(sp=>!!sp.placeholder)

        this.viewElements = this.elements.filter(sp=>!sp.placeholder)

        let bg = this.xml.selectFirst(['p:cSld',"p:bg"])

        if(bg){
            this.bg = new SlideBg(bg)
        }
    }

    getTextSize(idx,type){
        let finded = this.getPlaceholder(idx,type)
        if(finded && finded.txBody  && finded.txBody.textStyle){
            return finded.txBody.textStyle.getSize('0')
        }
    }

    getTextColor(idx,type){
        let finded = this.getPlaceholder(idx,type)
        if(finded && finded.txBody  && finded.txBody.textStyle){
            return finded.txBody.textStyle.getColor('0')
        }
    }

    getTxBody(idx,type){
        let finded = this.getPlaceholder(idx,type)
        return finded && finded.txBody
    }


    getPlaceholder(idx,type){
        if(!idx && !type){
            return
        }
        let finded = this.placeholders.find(sp=>{
            if(idx){
                return sp.idx == idx
            }
            return sp.type == type
        })

        return finded

    }

    getXfrm(idx,type){
        let finded = this.getPlaceholder(idx,type)
        if(finded && finded.xfrm){
            return finded.xfrm
        }
    }

    getRelationById(rid){
        return this.rel.getRelationById(rid)
    }

    /**
     * @param {import('./slide-layout-rel')} v
     */
    set rel(v) {
        this._relXml = v
    }

    get rel() {
        return this._relXml
    }

    
}


module.exports = SlideLayoutXML