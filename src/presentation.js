const XElement = require('./xelement')
const EmbeddedFontLst = require('./components/elements/p-embeddedFontLst')

module.exports = class PresentationXML {
    constructor(xml) {
        this.xml = XElement.init(xml)

        const lst = this.xml.getSingle('p:embeddedFontLst')
        if (lst) {
            this.embeddedFontLst = new EmbeddedFontLst(lst)
        }
    }

    /**
     * @param {import('./presentation-rel')} v
     */
    set rel(v) {
        this._relXml = v
    }

    get rel() {
        return this._relXml
    }

    get slideSize() {
        const sldSz = this.xml.getSingle('p:sldSz')
        const w = +sldSz.attributes.cx
        const h = +sldSz.attributes.cy

        return { width: (w * 96) / 914400, height: (h * 96) / 914400 }
    }

    /**
     * check font name is embed font or not
     * @param {string} fnt
     */
    isEmbeddeFont(fnt) {
        return this.embeddedFontLst && this.embeddedFontLst.isEmebed(fnt)
    }

    get fonts() {
        if (!this.embeddedFontLst) {
            return []
        }
        return this.embeddedFontLst.list.map(f => {
            return {
                name: f.name,
                url: this.rel.getRelationById(f.regular)
            }
        })
    }
}
