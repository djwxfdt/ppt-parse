const XElement = require('../../xelement')

const LnSpc = require('./a-lnSpc')

/**
 * This element specifies the amount of vertical white space that will be present before a paragraph. This space is specified in either percentage or points via the child elements <spcPct> and <spcPts>.
 */
class SpecBef{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        

        let spcPct = node.getSingle("a:spcPct")
        if(spcPct && spcPct.attributes.val){
            this.spcPct = +spcPct.attributes.val / 1000
        }

        let spcPts = node.getSingle("a:spcPts")
        if(spcPts && spcPts.attributes.val){
            this.spcPts = +spcPts.attributes.val / 100 / 3 * 4
        }
    }
}



module.exports =  class PPr{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        

        /**
         * Specifies the particular level text properties that this paragraph will follow. The value for this attribute is numerical and formats the text according to the corresponding level paragraph properties that are listed within the <lstStyle> element. Since there are nine separate level properties defined, this tag will have an effective range of 0-8 = 9 available values.
         */
        this.lvl = node.attributes.lvl || "0"


        let lnSpc = node.getSingle("a:lnSpc")

        if(lnSpc){
            this.lnSpc = new LnSpc(lnSpc)
        }

        let spcBef = node.getSingle("a:spcBef")
        if(spcBef){
            this.spcBef = new SpecBef(spcBef)
        }
    }

    get lineSpacePercent(){
        if(this.lnSpc){
            return this.lnSpc.spcPct
        }
    }

    get spaceBefore(){
        if(this.spcBef){
            return this.spcBef.spcPts
        }
    }
}