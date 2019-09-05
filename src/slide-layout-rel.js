const XElement = require('./xelement')

class SlideLayoutRelXml {
    constructor(xml) {
       /**
         * @type {Array<XElement>}
         */
        this.relations = XElement.init(xml.Relationships.Relationship)
    }

    get masterPath() {

        if(Array.isArray(this.relations)){
            for(let item of this.relations){
                let p = item.selectFirst(['attrs','Type'])
                if(p && p.indexOf('relationships/slideMaster') > -1){
                    p = item.selectFirst(["attrs",'Target'])
                    return p.replace('../', 'ppt/')
                }
            }
        }
        return null
      
    }

    getRelationById(rid){
        if(Array.isArray(this.relations)){
            for(let item of this.relations){
                let p = item.selectFirst(['attrs','Id'])
                if(p == rid){
                    p = item.selectFirst(["attrs",'Target'])
                    return p.replace('../', 'ppt/')
                }
            }
        }
        return null
    }
}


module.exports = SlideLayoutRelXml