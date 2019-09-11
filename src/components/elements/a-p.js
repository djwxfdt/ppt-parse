const R = require('./a-r')
const XElement = require('../../xelement')

const PPr = require('./a-pPr')

module.exports =  class P{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        

        this.rList = node.selectArray(["a:r"]).map(r=>new R(r))

        let pPr = node.getSingle("a:pPr")

        if(pPr){
            this.pPr = new PPr(pPr)
        }
    }

    get lineSpacePercent(){
        if(this.pPr){
            return this.pPr.lineSpacePercent
        }
    }
}