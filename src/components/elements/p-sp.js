const SpPr = require('./p-spPr')
const NvSpPr = require('./p-nvSpPr')
const TxBody = require('./p-txBody')


module.exports = class Sp {
    /**
     * @param {XElement} node 
     */
    constructor(node){

        this.tag = "p:sp"

        let spPr = node.selectFirst(["p:spPr"])
        if(spPr){
            this.spPr = new SpPr(spPr)
        }

        let nvSpPr = node.selectFirst(["p:nvSpPr"])
        if(nvSpPr){
            this.nvSpPr = new NvSpPr(nvSpPr)
        }

        let txBody = node.getSingle('p:txBody')
        if(txBody){
            this.txBody = new TxBody(txBody)
        }
        
    }

    get id(){
        if(this.nvSpPr && this.nvSpPr.cNvPr){
            return this.nvSpPr.cNvPr.id
        }
    }

    get name(){
        if(this.nvSpPr && this.nvSpPr.cNvPr){
            return this.nvSpPr.cNvPr.name
        }
    }

    get placeholder(){
        if(this.nvSpPr && this.nvSpPr.nvPr && this.nvSpPr.nvPr.placeholder){
            return this.nvSpPr.nvPr.placeholder
        }
    }

    get type(){
        if(this.placeholder){
            return this.placeholder.type
        }
    }

    get xfrm(){
        if(this.spPr ){
            return this.spPr.xfrm
        }
    }

    get custGeom(){
        if(this.spPr){
            return this.spPr.custGeom
        }
    }

    get solidFill(){
        if(this.spPr && this.spPr.solidFill){
            return this.spPr.solidFill.color
        }
    }
    get prstGeom(){
        if(this.spPr){
            return this.spPr.prstGeom
        }
    }


}