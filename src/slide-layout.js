const XElement = require('./xelement')

const {createSp,createPic,createGroupSp} = require('./components/ShapeTree')

class SlideLayoutXML {
    constructor(xml) {
        this.xml = XElement.init(xml).get("p:sldLayout")
        this.shapes = this.xml.selectArray(['p:cSld', 'p:spTree','p:sp']).map(sp=>createSp(sp))

        this.pics = this.xml.selectArray(['p:cSld', 'p:spTree','p:pic']).map(sp=>createPic(sp))
        this.placeholders = this.shapes.filter(sp=>!!sp.placeholder)
        this.viewShapes = this.shapes.filter(sp=>!sp.placeholder)

        this.groupShapes = this.xml.selectArray(['p:cSld', 'p:spTree', 'p:grpSp']).map(sp => createGroupSp(sp))

    }

    getTextSizeOfType(type){
        let txBody = this.getTxBodyOfType(type)
        if(txBody  && txBody.textStyle){
            return txBody.textStyle.getSize('0')
        }
    }

    getTextColorOfType(type){
        let txBody = this.getTxBodyOfType(type)
        if(txBody  && txBody.textStyle){
            return txBody.textStyle.getColor('0')
        }
    }

    getTxBodyOfType(type){
        if(!type){
            return
        }
        let finded = this.placeholders.find(sp=>sp.type == type)
        if(finded && finded.txBody){
            return finded.txBody
        }
    }



    get background() {
        let bgPr = this.xml.selectFirst(['p:cSld', 'p:bg', 'p:bgPr'])
        let bgRef = this.xml.selectFirst(['p:cSld', 'p:bg', 'p:bgRef'])
    }

    /**
     * @param {import('./slide-layout-rel')} v
     */
    set rel(v) {
        this._relXml = v

        this.pics.filter(p=>p.embed).map(p=>{
            if(!p.src){
                p.src = this.rel.getRelationById(p.embed)
            }
            return p
        })

        this.groupShapes.map(gp=>{
            gp.pics.filter(p=>p.embed).map(p=>{
                if(!p.src){
                    p.src = this.rel.getRelationById(p.embed)
                }
                return p
            })
        })
    }

    get rel() {
        return this._relXml
    }

    get tables(){
        if (this._tables) {
            return this._tables
        }

        /**
         * @type {{[key:string]:XElement}}
         */
        let idTable = {}
        /**
         * @type {{[key:string]:XElement}}
         */
        let idxTable = {}
        /**
         * @type {{[key:string]:XElement}}
         */
        let typeTable = {}

        let nodes = this.xml.selectFirst(['p:cSld', 'p:spTree'])
        for (let key in nodes.elements) {
            if (key === 'p:nvGrpSpPr' || key === 'p:grpSpPr') {
                continue
            }
            let node = nodes.selectArray([key])

            node.map(sp=>{
                const id = sp.selectFirst(['p:nvSpPr','p:cNvPr', 'attrs', 'id'])
                const idx = sp.selectFirst(['p:nvSpPr','p:nvPr', 'p:ph', 'attrs', 'idx'])
                const type = sp.selectFirst(['p:nvSpPr','p:nvPr', 'p:ph', 'attrs', 'type'])
                if(id){
                    idTable[id] = sp
                }
                if(idx){
                    idxTable[idx] = sp
                }
                if(type){
                    typeTable[type] = sp
                }
            })
        }

        this._tables = {idTable,idxTable,typeTable}
        return this._tables
    }

    // getTextSize(){
    //     return this.xml.selectFirst(['p:txBody', 'a:lstStyle', 'a:lvl1pPr', 'a:defRPr', 'attrs', 'sz'])
    // }

    getSizeOfType(type){
        let table = this.tables.typeTable[type]
        if(table){
            return table.selectFirst(['p:txBody', 'a:lstStyle', 'a:lvl1pPr', 'a:defRPr', 'attrs', 'sz'])
        }
        return undefined
    }

    /**
     * 
     * @param {string} type 
     */
    findPlaceHolder(type){
        let elements = this.xml.selectArray(['p:cSld',"p:spTree","p:sp"])

        return elements.find(el=>{
            let p = el.selectFirst(["p:nvSpPr","p:nvPr","p:ph"])
            if(p && p.attributes.type == type){
                return true
            }
        })
    }

    /**
     * 
     * @param {{[key:string]:XElement}} elements 
     * TODO 这里要重新规划
     */
    merge(elements){
        let shapes = this.xml.selectFirst(['p:cSld',"p:spTree"]).elements

        let pics = shapes["p:pic"]
        
        if(pics){
            elements["p:picLayout"] = pics
        }

        return elements
    }

    
}


module.exports = SlideLayoutXML