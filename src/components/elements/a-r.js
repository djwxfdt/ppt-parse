
const RPr = require('./a-rpr')
const XElement = require('../../xelement')

module.exports = class R{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        

        /**
         * @type {string}
         */
        this.text = node.getSingle('a:t')
        if(node.getSingle('a:rPr')){
            this.rPr = new RPr(node.getSingle('a:rPr'))
        } 

       
    }

    get fontSize(){
        if(this.rPr){
            return this.rPr.size
        }
    }

    get solidFill(){
        if(this.rPr){
            return this.rPr.solidFill
        }
    }

    get fontFamlily(){
        if(this.rPr){
            return this.rPr.typeface
        }
    }
}