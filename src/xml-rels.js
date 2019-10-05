const XElement = require('./xelement')

class BaseRelXML {
    constructor(xml) {
        /**
         * @type {Array<XElement>}
         */
        this.relations = XElement.init(xml).selectArray(['Relationship'])
    }

    getRelationByType(type) {
        for (const item of this.relations) {
            if (
                item.attributes.Type &&
                item.attributes.Type.indexOf(`relationships/${type}`) > -1
            ) {
                return item.attributes.Target.replace('../', 'ppt/')
            }
        }
        return null
    }

    getRelationById(rid) {
        for (const item of this.relations) {
            const p = item.attributes.Id
            if (p == rid) {
                return item.attributes.Target.replace('../', 'ppt/')
            }
        }
        return null
    }
}

class SlideRelXML extends BaseRelXML {
    get layoutPath() {
        return this.getRelationByType('slideLayout')
    }
}

class SlideLayoutRelXml extends BaseRelXML {
    get masterPath() {
        return this.getRelationByType('slideMaster')
    }
}

class PresentationRelXML extends BaseRelXML {
    get themePath() {
        return this.getRelationByType('theme')
    }
}

class MasterRelXml extends BaseRelXML {}

module.exports = BaseRelXML

module.exports.SlideRelXML = SlideRelXML
module.exports.SlideLayoutRelXml = SlideLayoutRelXml
module.exports.PresentationRelXML = PresentationRelXML
module.exports.MasterRelXml = MasterRelXml
