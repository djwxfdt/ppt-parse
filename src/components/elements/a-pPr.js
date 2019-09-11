const XElement = require('../../xelement')

const LnSpc = require('./a-lnSpc')

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
    }

    get lineSpacePercent(){
        if(this.lnSpc){
            return this.lnSpc.spcPct
        }
    }
}