const XElement = require("../../xelement")

const TxBody = require("./p-txBody")

const Ln = require("./a-ln")

const Pic = require("./p-pic")

class TcPr{
    /**
     * @param {XElement} node
     */
    constructor(node) {

        this.marT = this.toPix(node.attributes.marT)

        this.marB = this.toPix(node.attributes.marB)
        
        this.marR = this.toPix(node.attributes.marR)

        this.marL = this.toPix(node.attributes.marL)

        this.anchor = node.attributes.anchor 

        let lnL = node.getSingle("a:lnL")
        if(lnL){
            this.lnL = new Ln(lnL)
        }

        let lnR = node.getSingle("a:lnR")
        if(lnR){
            this.lnR = new Ln(lnR)
        }

        let lnT = node.getSingle("a:lnT")
        if(lnT){
            this.lnT = new Ln(lnT)
        }

        let lnB = node.getSingle("a:lnB")
        if(lnB){
            this.lnB = new Ln(lnB)
        }
    }

    get margin(){
        return {
            t:this.marT,
            b:this.marB,
            r:this.marR,
            l:this.marL
        }
    }

    get ln(){
        let ln = this.lnL || this.lnR || this.lnB || this.lnT
        if(ln){
            return ln.toJSON()
        }
    }

    toPix(pt){
        if(!pt){
            return 0
        }
        return Math.floor(+pt * 96 / 91440) / 10
    }
}

class Tc{
    /**
     * @param {XElement} node
     */
    constructor(node) {
        let txBody = node.getSingle("a:txBody")
        if(txBody){
            this.txBody = new TxBody(txBody)
        }

        let tcPr = node.getSingle("a:tcPr")
        if(tcPr){
            this.tcPr = new TcPr(tcPr)
        }
    }
}


class Tr{
    /**
     * @param {XElement} node
     */
    constructor(node) {
        let h = node.attributes.h
        if(h){
            this.height = this.toPix(h)
        }

        this.tcs = node.selectArray(["a:tc"]).map(c=>new Tc(c))
    }

    toPix(pt){
        if(!pt){
            return 0
        }
        return Math.floor(+pt * 96 / 91440) / 10
    }
}

class Table{
    /**
     * @param {XElement} node
     */
    constructor(node) {

        this.trs = node.selectArray(["a:tr"]).map(c=>new Tr(c))

        let tblGrid = node.getSingle("a:tblGrid")

        if(tblGrid){
            this.gridCols = tblGrid.selectArray(["a:gridCol"]).map(c=>{
                return this.toPix(c.attributes.w)
            })
        }
    }

    toPix(pt){
        if(!pt){
            return 0
        }
        return Math.floor(+pt * 96 / 91440) / 10
    }
}

class OleObj{
     /**
     * @param {XElement} node
     */
    constructor(node) {
        this.rid = node.attributes["r:id"]
        this.imgW = this.toPix(node.attributes.imgW)
        this.imgH = this.toPix(node.attributes.imgH)

        let pic = node.getSingle("p:pic")
        if(pic){
            this.pic = new Pic(pic)
        }

        this.spid = node.attributes.spid
    }
    
    toPix(pt){
        if(!pt){
            return 0
        }
        return Math.floor(+pt * 96 / 91440) / 10
    }
}

class GraphicData {
    /**
     * @param {XElement} node
     */
    constructor(node) {
      
        /**
         * Specifies the URI, or uniform resource identifier that represents the data stored under this tag. The URI is used to identify the correct 'server' that can process the contents of this tag.
         */
        this.uri = node.attributes.uri

        let table = node.getSingle("a:tbl")
        if(table){
            this.table = new Table(table)
            this.type = "table"
        }

        let oleObj = node.selectFirst(["p:oleObj"]) || node.selectFirst(["mc:AlternateContent","mc:Choice","p:oleObj"])


        if(oleObj){
            this.type = "oleObj"
            this.oleObj = new OleObj(oleObj)
        }

    }
}

module.exports = class Graphic {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        let gData = node.getSingle("a:graphicData")
        if(gData){
            this.graphicData = new GraphicData(gData)
        }
    }

    get type(){
        if(this.graphicData){
            return this.graphicData.type
        }
    }

    get table(){
        if(this.graphicData){
            return this.graphicData.table
        }
    }

    get oleObj(){
        if(this.graphicData){
            return this.graphicData.oleObj
        }
    }
};
