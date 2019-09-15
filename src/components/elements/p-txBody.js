const {TextStyle} = require('../text-styles')
const P = require('./a-p')
const XElement = require('../../xelement')

const BodyPr = require('./a-bodyPr')

module.exports = class TxBody{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        

        this.pList = node.selectArray(["a:p"]).map(p=>new P(p))

        let lstStyle = node.getSingle('a:lstStyle')
        if(lstStyle){
            this.textStyle = new TextStyle(lstStyle)
        }

        let bodyPr = node.getSingle("a:bodyPr")
        if(bodyPr){
            this.bodyPr = new BodyPr(bodyPr)
        }
        
    }

    get anchor(){
        if(this.bodyPr){
            return this.bodyPr.anchor
        }
    }

    get padding(){
        return this.bodyPr && this.bodyPr.padding
    }
}