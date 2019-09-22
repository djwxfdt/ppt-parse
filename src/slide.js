const { mapFont } = require('./utils')

const XElement = require('./xelement')

const ShapeTree = require('./components/ShapeTree')

const Sp = require('./components/elements/p-sp')
const Pic = require('./components/elements/p-pic')
const GroupSp = require("./components/elements/p-grpSp")

const GraphicFrame = require("./components/elements/p-graphicFrame")

const SlideBg = require("./components/elements/p-bg")

const TxBody = require("./components/elements/p-txBody")

const Transition = require("./components/elements/p-transition")

class SlideXML {
    constructor(xml) {

        this.xml = XElement.init(xml)


        let spTree = this.xml.selectFirst(['p:cSld', 'p:spTree'])
        
        this.elements = spTree.children.map(el=>ShapeTree.createElement(el)).filter(e=>!!e)

        let bg = this.xml.selectFirst(['p:cSld',"p:bg"])

        if(bg){
            this.bg = new SlideBg(bg)
        }

        let trans = this.xml.getSingle("p:transition")
        if(trans){
            this.transition = new Transition(trans)
        }
    }

    get nodes() {

        if (this._json) {
            return this._json
        }

        let obj = {
            backgroundImage: this.bg && this.bg.imageSrc,
            blocks: [],
            backgroundColor: (this.bg && this.bg.color) ||  (this.master.bg && this.master.bg.color)
        }

        let trans = this.transition || this.master.transition

        if(trans){
            obj.transition = trans
        }

        
        if(obj.backgroundColor){
            if(obj.backgroundColor.type == "grad"){
                obj.backgroundColor.value = obj.backgroundColor.value.map(c=>{
                    let obj = {pos:c.pos}
                    obj.color = this.getSolidFill(c.color)
                    return obj
                }).filter(c=>!!c.color)
            }else if(obj.backgroundColor.type == "schemeClr"){
                obj.backgroundColor.value = this.getSolidFill( obj.backgroundColor)
            }
        }


        let arry = []

        this.layout.viewElements.map(sp=>{
            if(sp.tag == "p:sp"){
                arry.push(this.parseSp(sp,true))
            }else if(sp.tag == "p:pic"){
                arry.push(this.parsePic(sp,true))
            }else if(sp.tag == "p:grpSp"){
                arry.push(this.parseGrp(sp,true))
            }
        })

        this.elements.map(sp=>{
            if(sp.tag == "p:sp"){
                arry.push(this.parseSp(sp))
            }else if(sp.tag == "p:pic"){
                arry.push(this.parsePic(sp))
            }else if(sp.tag == "p:grpSp"){
                arry.push(this.parseGrp(sp,false))
            }else if(sp.tag == "p:graphicFrame"){
                arry.push(this.parseGraphic(sp))
            }
        })

        obj.blocks = arry

        this._json = obj

        return obj
    }

    get json() {

    }

    /**
     * @param {import('./presentation')} v
     */
    set presentation(v) {
        this._presationXML = v
    }

    get presentation() {
        return this._presationXML
    }

    /**
     * @param {import('./slide-rel')} v
     */
    set rel(v) {
        this.relxml = v
        if(this.bg && this.bg.imageEmbed){
            this.bg.imageSrc = this.rel.getRelationById(this.bg.imageEmbed)
        }
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


    /**
     * @param {Pic} pic 
     */
    parsePic(pic,isLayout = false ) {

        let item = {
            src: isLayout ? this.layout.rel.getRelationById(pic.embed) : this.rel.getRelationById(pic.embed),
            type: "image"
        }

        if (pic.spPr && pic.spPr.xfrm) {
            item.position = pic.spPr.xfrm.off
            item.size = {
                width: pic.spPr.xfrm.ext.cx,
                height: pic.spPr.xfrm.ext.cy,
            }
        }

        return item
    }


    /**
     * 
     * @param {GroupSp} gp 
     */
    parseGrp(gp,isLayout=false){
        let container = {
            children: [...gp.shapes.map(sp => {
                return this.parseSp(sp,isLayout)
            }),...gp.pics.map(sp=>{
                return this.parsePic(sp,isLayout)
            }),...gp.groupShapes.map(sp=>this.parseGrp(sp,isLayout))],
            type:"group"
        }

        if (gp.xfrm) {
            container.position = gp.xfrm.off
            container.size = {
                width: gp.xfrm.ext.cx,
                height: gp.xfrm.ext.cy,
            }
            if (gp.xfrm.rot) {
                container.rot = gp.xfrm.rot
            }
            if(gp.xfrm.chOff){
                container.chOff = gp.xfrm.chOff
            }
            if(gp.xfrm.chExt){
                container.chExt = gp.xfrm.chExt
            }
        }
        return container
    }

    /**
     * 
     * @param {GraphicFrame} frame 
     */
    parseGraphic(frame){
        let item =  {
            type:frame.graphic.type
        }

        if (frame.xfrm) {
            item.position = frame.xfrm.off
            item.size = {
                width: frame.xfrm.ext.cx,
                height: frame.xfrm.ext.cy,
            }
            if (frame.xfrm.rot) {
                item.rot = frame.xfrm.rot
            }
        }

        if(item.type == "table"){
            let table = frame.graphic.table
            item.table = {
                cols:table.gridCols,
                trs:table.trs.map(tr=>{
                    return {
                        tcs:tr.tcs.map(tc=>{
                            let content =  {
                                body:this.parseTxBody(tc.txBody),
                                ln:tc.tcPr && tc.tcPr.ln
                            }
                            if(content.ln && content.ln.color){
                                content.ln.color = this.getSolidFill(content.ln.color)
                            }
                            return content
                        }),
                        height:tr.height
                    }
                })
            }
        }

        return item
    }

    /**
     * 
     * @param {Sp} sp 
     */
    parseSp(sp, isLayout = false) {

        let type = sp.type

        let container = {
            type: "container",
            valign: sp.txBody && sp.txBody.anchor,
            padding:sp.txBody && sp.txBody.padding,
            id:sp.id
        }

        let xfrm = sp.xfrm || (!isLayout && this.layout.getXfrm(sp.idx,sp.type))

        if (xfrm) {
            container.position = xfrm.off
            container.size = {
                width: xfrm.ext.cx,
                height: xfrm.ext.cy,
            }
            if (xfrm.rot) {
                container.rot = xfrm.rot
            }
        }

        if (sp.custGeom) {
            container.svgs = sp.custGeom.paths
        }

        if(sp.prstGeom){
            container.prstShape = sp.prstGeom
        }

        if (sp.solidFill) {
            container.fill = this.getSolidFill(sp.solidFill)
        }

        if(sp.ln){
            container.ln = {
                color:sp.ln.solidFill && this.getSolidFill(sp.ln.solidFill),
                round:sp.ln.round,
                prstDash:sp.ln.prstDash,
                width:sp.ln.width
            }
        }

        let fontSize = (!isLayout && this.layout.getTextSize(sp.idx,sp.type)) || this.master.getTextSizeOfType(type)
        if (fontSize) {
            container.fontSize = fontSize
        }

        let color = (!isLayout && this.layout.getTextColor(sp.idx,sp.type)) || this.master.getTextColorOfType(sp.type)
        if (color) {
            container.color = this.getSolidFill(color)
        }

        // if (custShapType) {
        //     // debugger
        // }
        // if (shpType) {
        //     let fillColor = this.getShapeFillOfNode(node)
        //     if (fillColor) {
        //         container.type = shpType
        //         container.fillColor = fillColor
        //     }
        // }

        let text = this.parseTxBody(sp.txBody,sp.type)
    
        if (text) {
            container.text = text
        }

        return container

    }

    /**
     * @param {TxBody} txBody 
     */
    parseTxBody(txBody,type){
        if(!txBody){
            return
        }
        let titleColor = this.getSolidFill(this.master.titleColor)
        return txBody.pList.map(p => {
            let container = {
                children: p.rList.map(r => {
                    let sz = r.fontSize
                    if (r.rPr && r.rPr.baseline && !isNaN(sz)) {
                        sz -= 10
                    }

                    let fontFamily = r.fontFamlily
                    if (fontFamily && fontFamily.indexOf('+') == 0) {
                        fontFamily = this.theme.fontScheme.getFont(fontFamily)
                    }

                    if(type){
                        if(!fontFamily){
                            fontFamily = this.master.getTextFontOfType(type)
                        }
                        if (!fontFamily) {
                            fontFamily = this.theme.fontScheme.getFontByType(type)
                        }
                    }
                   

                    if (fontFamily && this.presentation.isEmbeddeFont(fontFamily)) {
                        // fontFamily = undefined
                    }

                    if(fontFamily){
                        fontFamily = mapFont(fontFamily)
                    }


                    let color = this.getSolidFill(r.solidFill)

                    if(r.rPr && r.rPr.link){
                        color = this.getSolidFill({type:"schemeClr",value:"hlink"}) || color
                    }

                    return {
                        type: "span",
                        value: r.text,
                        size: sz,
                        color,
                        fontFamily,
                        bold: r.rPr && r.rPr.bold,
                        italic: r.rPr && r.rPr.italic,
                        underline: r.rPr && r.rPr.underline,
                        strike: r.rPr && r.rPr.strike,
                        link: r.rPr && r.rPr.link
                        // valign:this.getTextVerticalAlign(r),
                    }
                }).filter(t => t)
            }

            if (p.lineSpacePercent) {
                container.lnPct = p.lineSpacePercent
            }

            if(p.lineSpacePix){
                container.lnPx = p.lineSpacePix
            }

            if (p.spaceBofore) {
                container.spcBef = p.spaceBofore
            }

            if (p.bullet) {
                container.bullet = p.bullet
                if(!p.bullet.color){
                    if(type){
                        container.bullet.color = this.master.getBulletColorOfType(type)
                    }
                }
            }
            // container.lnPt = p.lineSpacePercent || this.master.getLineSpacePercent(type)

            if ((type == "ctrTitle" || type == "title") && titleColor) {
                container.color = titleColor
            }

            if(type == "sldNum" && p.isSlideNum){
                container.isSlideNum = true
            }

            if(p.align){
                container.algn = p.align
            }

            return container
        })
    }

    /**
     * @param {XElement} node 
     */
    getTextVerticalAlign(node) {
        let baseline = node.selectFirst(['a:rPr', 'attrs', 'baseline'])
        if (baseline) {
            return +baseline / 1000
        }
    }

    /**
     * 
     * @param {XElement} node 
     */
    getShapeFillOfNode(node) {
        let fillType = node.selectFirst(['p:spPr'])
        if (fillType.get("a:solidFill")) {
            let color = node.selectFirst(['p:spPr', 'a:solidFill'])
            if (color.get('a:srgbClr')) {
                return color.selectFirst(["a:srgbClr", "attrs", "val"])
            }
        }
        return undefined
    }
    

    /**
     * 
     * @param {{type:"schemeClr"|"schemeClr",value:string}} solid 
     */
    getSolidFill(solid){
        if(!solid){
            return
        }
        if(solid.type == "schemeClr"){
            let k = this.master.findSchemeClr(solid.value) || solid.value
            if(k){
                return this.theme.getColor("a:" + k)
            }
        }else{
            return solid.value
        }
    }

}


module.exports = SlideXML