const XElement = require('./xelement')

class SlideLayoutRelXml {
    constructor(xml) {
       /**
         * @type {Array<XElement>}
         */
        this.relations = XElement.init(xml).selectArray(["Relationship"])

    }

    get masterPath() {
        for(let item of this.relations){
            let p = item.attributes.Type
            if(p && p.indexOf('relationships/slideMaster') > -1){
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


module.exports = SlideLayoutRelXml