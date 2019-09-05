const { searchXML } = require('./utils')

const XElement = require('./xelement')

class SlideXML {
    constructor(xml) {

        this.xml = XElement.init(xml).get('p:sld')

        this.shapes = this.xml.selectFirst(['p:cSld', 'p:spTree'])

    }

    get nodes() {
        // this.shapes.

        if(this._json){
            return this._json
        }

        let obj = {
            background:this.background,
            blocks:[]
        }

        let arry = []

        let shapes = this.layout.merge(this.shapes.elements)

        for(let key in shapes){
            switch (key) {
                case "p:nvGrpSpPr": {
                    break
                }
                case "p:pic": {
                    let obj = this.parsePic(shapes[key])
                    arry = [...arry,...obj]
                    break
                }
                case "p:picLayout":{
                    let obj = this.parsePic(shapes[key],true)
                    arry = [...arry,...obj]
                    break
                }
                case "p:sp": {
                    let obj = this.parseSp(shapes[key])
                    arry = [...arry,...obj]
                    break
                }
                default:{
                }
            }
        }

        // shapes.map((key, value) => {
        //     switch (key) {
        //         case "p:nvGrpSpPr": {
        //             break
        //         }
        //         case "p:pic": {
        //             let obj = this.parsePic(value)
        //             arry = [...arry,...obj]
        //             break
        //         }
        //         case "p:sp": {
        //             let obj = this.parseSp(value)
        //             arry = [...arry,...obj]
        //             break
        //         }
        //         default:{
        //         }
        //     }
        // })

        obj.blocks = arry

        this._json = obj

        return obj
    }

    get json() {

    }

    /**
     * @param {import('./slide-rel')} v
     */
    set rel(v) {
        this.relxml = v
    }

    get rel() {
        return this.relxml
    }

    /**
     * @param {import('./theme')} v
     */
    set theme(v) {
        this._theme = v
    }

    get theme() {
        return this._theme
    }

    /**
     * @param {import('./slide-layout')} v
     */
    set layout(v) {
        this.layoutxml = v
    }

    get layout() {
        return this.layoutxml
    }

    /**
     * @param {import('./slide-mater')} v
     */
    set master(v) {
        this.materxml = v
    }

    get master() {
        return this.materxml
    }

    get background() {
        if (this._background) {
            return this._background
        }

        let bgPr = searchXML(this.xml)(['p:cSld', 'p:bg', 'p:bgPr'])
        let bgRef = searchXML(this.xml)(['p:cSld', 'p:bg', 'p:bgRef'])

        if (bgPr) {

        } else if (bgRef) {

        } else if (this.layout.background) {

        } else {
            if (this.master) {
                this._background = this.master.getBackground(this._theme)
            }
        }

        return this._background
    }

    /**
     * @param {Array<XElement>} elements 
     */
    parsePic(elements,layout=false) {
        let arry = []
        if(Array.isArray(elements)){
            elements.forEach(node => {
                let rid = node.selectFirst(['p:blipFill', 'a:blip', 'attrs', 'r:embed'])
                let rel = this.rel.getRelationById(rid)
                if(layout){
                    rel = this.layout.rel.getRelationById(rid)
                }
                let xfrm = node.selectFirst(['p:spPr', 'a:xfrm'])

                let position = this.getPositionOfNode(xfrm)
                let size = this.getSizeOfNode(xfrm)

                arry.push({
                    src:rel,
                    position,
                    size,
                    type:"image"
                })
            })
        }
        return arry
    }

    /**
     * 
     * @param {Array<XElement>} elements 
     */
    parseSp(elements) {


        let arry = []

        if (Array.isArray(elements)) {
            elements.forEach(node => {
                let id = node.selectFirst(["p:nvSpPr", "p:cNvPr", "attrs", "id"])
                let name = node.selectFirst(['p:nvSpPr', 'p:cNvPr', 'attrs', 'name'])
                /**
                 * @type {string}
                 */
                let type = node.selectFirst(["p:nvSpPr", "p:nvPr", "p:ph", "attrs", "type"])
                let idx = node.selectFirst(['p:nvSpPr', 'p:nvPr', 'p:ph', 'attrs', 'idx'])


                /**
                 * @type{XElement}
                 */
                let masterSp = null
                let layoutSp = masterSp

                if (type) {
                    masterSp = this.master.tables.typeTable[type]
                    layoutSp = this.layout.tables.typeTable[type]
                }

                let xfrm = node.selectFirst(['p:spPr', 'a:xfrm'])

                let xfrmLayout = layoutSp?layoutSp.selectFirst(['p:spPr', 'a:xfrm']):null
                let shpType = node.selectFirst(['p:spPr', 'a:prstGeom', 'attrs', 'prst'])
                let custShapType = node.selectFirst(['p:spPr', 'a:custGeom'])
                let position = this.getPositionOfNode(xfrm)
                let size = this.getSizeOfNode(xfrm)

                let container = {
                    type:"container",
                    size,
                    position,
                    valign:this.getVerticalAlign(node)
                }

                arry.push(container)

                if (custShapType) {
                    // debugger
                }
                if (shpType) {
                    let fillColor = this.getShapeFillOfNode(node)
                    if(fillColor){
                        container.type = shpType
                        container.fillColor = fillColor
                    }
                }
                   
                let text = this.getTextOfNode(node.selectFirst(['p:txBody']),type)
                if (text) {
                    container.text = text
                }
            })
        }


        return arry
    }

    /**
     * @param {XElement} xfrm 
     */
    getPositionOfNode(xfrm) {
        if (xfrm) {
            let off = xfrm.selectFirst(['a:off', 'attrs'])
            if (off) {
                return {
                    x: Math.floor(+off.get('x') * 96 / 91440) / 10,
                    y: Math.floor(+off.get('y') * 96 / 91440) / 10
                }
            }
        }
        return null
    }

    /**
     * @param {XElement} xfrm 
     */
    getSizeOfNode(xfrm) {
        if (xfrm) {
            let ext = xfrm.selectFirst(['a:ext', 'attrs'])
            if (ext) {
                return {
                    width: Math.floor(+ext.get('cx') * 96 / 91440) / 10,
                    height: Math.floor(+ext.get('cy') * 96 / 91440) / 10
                }
            }
        }
        return null
    }

    /**
     * @param {XElement} txNode 
     */
    getTextOfNode(txNode,type) {
        if (!txNode) {
            return null
        }
        let ps = txNode.selectArray(['a:p'])
        let textStyles = this.master.textStyles
        let texts = []
        for (let p of ps) {
            let rs = p.selectArray(['a:r'])
            let align = this.getHorizontalAlign(p)
            let container = {
                align,
                children:[]
            }

            let lvl = p.selectFirst(['a:pPr','attrs','lvl'])
            if(lvl){
                let c = this.master.getLvlFontColor(lvl)
                container.color = c
            }

            texts.push(container)
            for (let r of rs) {
                let size = this.getFontSizeOfNode(r,type)
                container.children.push({
                    type: "span",
                    value: r.selectFirst(['a:t']),
                    size,
                    color:this.getFontColorOfNode(r,type),
                    fontFamily:this.getFontFamilyOfNode(r,type),
                    valign:this.getTextVerticalAlign(r),
                    decoration:this.getTextDecoration(r),
                    fontStyle:this.getTextStyle(r)
                })
            }
        }
        return texts
    }

    /**
     * @param {XElement} node 
     */
    getFontSizeOfNode(node,type){  
        let size = node.selectFirst(["a:rPr","attrs","sz"])  
        if(isNaN(size)){
            size = this.layout.getSizeOfType(type)
            if(isNaN(size)){
                size = this.master.getTextSizeOfType(type)
            }
        }
        if(size){
            size =  +size / 100
        }

        let baseline = node.selectFirst(['a:rPr', 'attrs', 'baseline'])
        if(baseline && !isNaN(size)){
            size -= 10
        }
        if(!isNaN(size)){
            size = size / 3 * 4
        }
        return size
    }

    /**
     * 
     * @param {XElement} node 
     * @param {*} type 
     */
    getFontColorOfNode(node,type){
        let fill = node.selectFirst(['a:rPr','a:solidFill'])
        let color
        if(!fill){
            // let colorMap = this.master.getColorMap("tx1")
            
            return color
        }

        color = fill.selectFirst(['a:srgbClr', 'attrs', 'val'])
        if(color){
            return color
        }

        color = fill.selectFirst(['a:schemeClr', 'attrs', 'val'])
        if(color){
            return color
        }
    }

     /**
     * 
     * @param {XElement} node 
     * @param {*} type 
     */
    getFontFamilyOfNode(node,type){
        let family = node.selectFirst(['a:rPr', 'a:latin', 'attrs', 'typeface'])
        if(family && family.indexOf('+') == 0){
            family = this.theme.getFontTheme(family)
        }
        if(!family){
            family = this.theme.getFontFamily(type)
        }
        return family
    }

    /**
     * @param {XElement} node 
     */
    getTextVerticalAlign(node){
        let baseline = node.selectFirst(['a:rPr', 'attrs', 'baseline'])
        if(baseline){
            return +baseline / 1000
        }
    }

    /**
     * @param {XElement} node 
     */
    getTextDecoration(node){
        let underline = node.selectFirst(["a:rPr","attrs","u"])
        let strike = node.selectFirst(["a:rPr","attrs","strike"])
        if(underline && strike){
            return "underline line-through"
        }
        if(underline){
            return "underline"
        }
        if(strike){
            return "line-through"
        }
    }

    /**
     * @param {XElement} node 
     */
    getTextStyle(node){
        return node.selectFirst(["a:rPr","attrs","i"]) ? "italic" : undefined
    }
    

    /**
     * @param {XElement} shape 
     * @param {*} type 
     */
    getHorizontalAlign(shape,type){
        let align = shape.selectFirst(['a:pPr', 'attrs', 'algn'])
        switch(align){
            case "ctr":{
                return "center"
            }
            case "r":{
                return "right"
            }
            default:{
                return "left"
            }
        }
    }

    /**
     * @param {XElement} shape 
     * @param {*} type 
     */
    getVerticalAlign(shape,type){
        let anchor = shape.selectFirst(['p:txBody', 'a:bodyPr', 'attrs', 'anchor'])
        switch(anchor){
            case "ctr":{
                return "middle"
            }
            case "b":{
                return "bottom"
            }
            default:{
                return "top"
            }
        }
    }

    /**
     * 
     * @param {XElement} node 
     */
    getShapeFillOfNode(node){
        let fillType = node.selectFirst(['p:spPr'])
        if(fillType.get("a:solidFill")){
            let color= node.selectFirst(['p:spPr','a:solidFill'])
            if(color.get('a:srgbClr')){
                return color.selectFirst(["a:srgbClr","attrs","val"])
            }
        }
        return undefined
    }
}


module.exports = SlideXML