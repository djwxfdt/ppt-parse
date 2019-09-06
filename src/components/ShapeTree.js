const XElement = require('../xelement')

const {TextStyle} = require('./text-styles')

const RPr = require('./elements/a:rpr')
class SpElement{

}

class NvGrpSpPr extends SpElement{

}

class Xfrm{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        

        
        let ext = node.getSingle("a:ext")
        if(ext){
            /**
             * This element specifies the size of the bounding box enclosing the referenced object.
             */
            this.ext = {
                cx:+ext.attributes.cx,
                cy:+ext.attributes.cy
            }

            this.ext.cx = Math.floor(this.ext.cx * 96 / 91440) / 10
            this.ext.cy = Math.floor(this.ext.cy * 96 / 91440) / 10

        }

        let off = node.getSingle("a:off")
        if(off){
            /**
             * This element specifies the location of the bounding box of an object. Effects on an object are not included in this bounding box.
             */
            this.off = {
                x:+off.attributes.x,
                y:+off.attributes.y
            }
            this.off.x = Math.floor(this.off.x * 96 / 91440) / 10
            this.off.y = Math.floor(this.off.y * 96 / 91440) / 10
        }
    }
}

class SpPr{
     /**
     * @param {XElement} node 
     */
    constructor(node){
        

        let xfrm = node.getSingle("a:xfrm")

        if(xfrm){
            /**
             * This element represents 2-D transforms for ordinary shapes
             */
            this.xfrm = new Xfrm(xfrm)
        }
    }
}



class R{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        

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

class P{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        

        this.rList = node.selectArray(["a:r"]).map(r=>new R(r))
    }
}

class TxBody{
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

class NvPr{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        

        let ph = node.getSingle('p:ph')

        if(ph){
            this.placeholder = {
                idx:ph.attributes.idx,
                type:ph.attributes.type,
                sz:ph.attributes.sz,
                orient:ph.attributes.orient
            }
        }
        
    }
}


class CNvPr{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        this.id = node.attributes.id
        this.name = node.attributes.name
    }
}

/**
 * This element specifies all non-visual properties for a shape. 
 * This element is a container for the non-visual identification properties,
 *  shape properties and application properties that are to be associated with a shape. 
 * This allows for additional information that does not affect the appearance of the shape to be stored.
 */
class NvSpPr{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        
        let cNvPr = node.selectFirst(["p:cNvPr"])
        if(cNvPr){
            this.cNvPr = new CNvPr(cNvPr)
        }

        let nvPr = node.getSingle("p:nvPr")
        if(nvPr){
            this.nvPr = new NvPr(nvPr)
        }
        
    }
}

class Sp extends SpElement{
    /**
     * @param {XElement} node 
     */
    constructor(node){

        super()

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


}

class Pic extends SpElement{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        this.name = "p:sp"
        
        let spPr = node.selectFirst(["spPr"])
        if(spPr){
            this.spPr = new SpPr(spPr)
        }
    }
}

/**
 * 
 * @param {XElement} node 
 * @returns {Sp}
 */
module.exports.createSp = (node)=>{
    return new Sp(node)
} 

/**
 * @param {XElement} node 
 * @returns {Sp}
 */
module.exports.createPic = node =>{

}