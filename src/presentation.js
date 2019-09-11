const XElement = require('./xelement')
const EmbeddedFontLst = require("./components/elements/p-embeddedFontLst")

module.exports = class PresentationXML {


    constructor(xml) {
       
        this.xml = XElement.init(xml).get("p:presentation")

        let lst = this.xml.getSingle("p:embeddedFontLst")
        if(lst){
            this.embeddedFontLst = new EmbeddedFontLst(lst)
        }
    }

    get slideSize() {
        let sldSz = this.xml.getSingle("p:sldSz") 
        let w = +sldSz.attributes.cx
        let h = +sldSz.attributes.cy

        return { width: w * 96 / 914400, height: h * 96 / 914400 }
    }

    /**
     * check font name is embed font or not
     * @param {string} fnt 
     */
    isEmbeddeFont(fnt){
        return this.embeddedFontLst && this.embeddedFontLst.isEmebed(fnt)
    }
}
