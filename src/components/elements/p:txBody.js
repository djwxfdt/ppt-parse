const {TextStyle} = require('../text-styles')
const P = require('./a:p')

module.exports = class TxBody{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        

        this.pList = node.selectArray(["a:p"]).map(p=>new P(p))

        let other = node.getSingle('a:lstStyle')
        if(other){
            this.textStyle = new TextStyle(other)
        }
        
    }
}