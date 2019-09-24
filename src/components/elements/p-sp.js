const SpPr = require('./p-spPr')
const NvSpPr = require('./p-nvSpPr')
const TxBody = require('./p-txBody')
const XElement = require('../../xelement')
const Style = require("./p-style")


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
        let style = node.getSingle("p:style")
        if(style){
            this.style = new Style(style)
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

    get idx(){
        return this.placeholder && this.placeholder.idx
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

    get hasNoFill(){
        return this.spPr && this.spPr.noFill
    }

    get fill(){
        let solid = this.solidFill
        let gradFill = this.spPr && this.spPr.gradFill

        if(solid){
            return {type:"solid",value:solid}
        }
        if(gradFill){
            return {type:"grad",value:gradFill}
        }
    }

    get line(){
        let ln = this.spPr && this.spPr.ln
        if(ln){
            return ln.toJSON()
        }
        if(this.style && this.style.lnRef){
            return {
                color:this.style.lnRef,
            }
        }

    }

    get solidFill(){
        if(this.spPr && this.spPr.solidFill){
            return this.spPr.solidFill
        }else if(this.style && this.style.fillRef){
            return this.style.fillRef
        }
    }
    get prstGeom(){
        if(this.spPr){
            return this.spPr.prstGeom
        }
    }

    // get ln(){
    //     if(this.spPr && this.spPr.ln && this.spPr.ln.exsist){
    //         return this.spPr.ln
    //     }
    // }

}