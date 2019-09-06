const XElement = require('./xelement')

const TextStyles = require('./components/text-styles')

const {createSp} = require('./components/ShapeTree')

class SlideMasterXML {
    constructor(xml) {
        this.xml = XElement.init(xml).get("p:sldMaster")

        this.textStyles = new TextStyles(this.xml.getSingle("p:txStyles"))

        this.shapes = this.xml.selectArray(['p:cSld', 'p:spTree','p:sp']).map(sp=>createSp(sp))

    }

    get titleColor(){
        let titleSp = this.shapes.find(sp=>sp.type == "title")
        if(titleSp && titleSp.txBody && titleSp.txBody.textStyle){
            return titleSp.txBody.textStyle.getColor('0')
        }
    }

    /**
     * @param {ThemeXML} themeXml 
     */
    getBackground(themeXml) {
        let bgPr = this.xml.selectFirst(['p:cSld', 'p:bg', 'p:bgPr'])
        let bgRef = this.xml.selectFirst(['p:cSld', 'p:bg', 'p:bgRef'])
        let bgColor = null

        if (bgPr) {

        } else if (bgRef) {

            let phCl = bgRef.selectFirst(['a:srgbClr', 'a:srgbClr', 'attrs', 'val'])
            if (!phCl) {
                let c = bgRef.selectFirst(['a:schemeClr', 'attrs', 'val'])
                let theme = "a:" + bgRef.selectFirst(['p:clrMap', 'attrs',c]) 
                bgColor = themeXml.getColor(theme)
            }

            let idx = bgRef.selectFirst(["attrs", "idx"])
            if (+idx > 1000) {
                // console.log('bgColor:', bgColor)
            } else {
                bgColor = null
            }
        }
        return bgColor

    }


    get tables() {
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

            // for(let sp of node){
                
            // }
        }

        this._tables = {idTable,idxTable,typeTable}
        return this._tables
    }

    get textStyle(){
        return this.xml.selectFirst(['p:txStyles'])
    }

    getTextSizeOfType(type){
        switch(type){
            case "title":
            case "subTitle":
            case "ctrTitle":{
                return this.textStyle.selectFirst(['p:titleStyle', 'a:lvl1pPr', 'a:defRPr', 'attrs', 'sz'])
            }
            case "body":{
                return this.textStyle.selectFirst(['p:bodyStyle', 'a:lvl1pPr', 'a:defRPr', 'attrs', 'sz'])
            }
            case "sldNum":
            case "dt":{
                return 1200
            }
            default:{
                return this.textStyle.selectFirst(['p:otherStyle', 'a:lvl1pPr', 'a:defRPr', 'attrs', 'sz'])
            }
        }
       
    }

    /**
     * 
     * @param {"tx1"|"tx2"|"bg1"|"bg2"} str 
     */
    getColorMap(str){
        return this.xml.selectFirst(["p:clrMap","attrs",str])
    } 

    /**
     * 
     * @param {*} lvl 
     */
    getLvlFontColor(lvl){
        let styles =  this.xml.selectFirst(["p:cSld","p:spTree","p:sp","p:txBody","a:lstStyle"])

        for(let key in styles.elements) {
            let ele = styles.elements[key]
            if(Array.isArray(ele)){
                ele = ele[0]
            }
            if(ele.selectFirst(["attrs","lvl"]) == lvl){
                return ele.selectFirst(["a:defRPr","a:solidFill","a:srgbClr","attrs","val"])
            }
        }
        // debugger
        // let 
        //     `lvl${+lvl + 1}pPr`,])

        // for(let lvl of lvls){
        //     let styles = lvl.selectFirst([])
        //     if(styles){
        //         break
        //     }
        // }
    }
}

module.exports = SlideMasterXML