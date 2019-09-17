const XElement = require('./xelement')


module.exports = class PresentationRelXML {
   
    constructor(xml) {
         this.relations = XElement.init(xml).selectArray(["Relationship"])
     }


    get themePath() {
        // let relations = this.xml.selectArray(["Relationships","Relationship"])
        for(let item of this.relations){
            let p = item.attributes.Type
            if(p && p.indexOf('relationships/theme') > -1){
                return item.attributes.Target.replace('../', 'ppt/')
            }
        }
        return null
    }
}