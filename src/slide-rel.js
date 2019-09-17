const XElement = require('./xelement')


class SlideRelXML {
    constructor(xml) {
        /**
         * @type {Array<XElement>}
         */
        // this.relations = XElement.init(xml.Relationships.Relationship)
        this.relations = XElement.init(xml).selectArray(["Relationship"])


    }

    get layoutPath() {
        for(let item of this.relations){
            let p = item.attributes.Type
            if(p && p.indexOf('relationships/slideLayout') > -1){
                return item.attributes.Target.replace('../', 'ppt/')
            }
        }
        return null
    }

    getRelationById(rid){
        for(let item of this.relations){
            let p = item.attributes.Id
            if(p == rid){
                return item.attributes.Target.replace('../', 'ppt/')
            }
        }
        return null
    }


}

module.exports = SlideRelXML