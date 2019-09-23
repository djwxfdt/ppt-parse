const XElement = require('./xelement')

const TextStyles = require('./components/text-styles')

const SlideBg = require("./components/elements/p-bg")

const Transition = require("./components/elements/p-transition")

const ShapeTree = require('./components/ShapeTree')

const Sp = require('./components/elements/p-sp')
const Pic = require('./components/elements/p-pic')
const GroupSp = require("./components/elements/p-grpSp")
const GraphicFrame = require("./components/elements/p-graphicFrame")

const { mapFont } = require('./utils')

module.exports = class BaseSlide{

    constructor(xml) {

        this.xml = XElement.init(xml)

        let spTree = this.xml.selectFirst(['p:cSld', 'p:spTree'])

        this.elements = spTree.children.map(el=>ShapeTree.createElement(el)).filter(e=>!!e)

        this.placeholders = this.elements.filter(sp=>!!sp.placeholder)

        this.viewElements = this.elements.filter(sp=>!sp.placeholder)

        let bg = this.xml.selectFirst(['p:cSld',"p:bg"])

        if(bg){
            this.bg = new SlideBg(bg)
        }

        let trans = this.xml.getSingle("p:transition")
        if(trans){
            this.transition = new Transition(trans)
        }

        /**
         * @type {"slide"|"layout"|"master"}
         */
        this.type = ""

    }

    get backgroundImg(){
        if(this.bg && this.bg.imageEmbed){
            return this.rel.getRelationById(this.bg.imageEmbed)
        }
    }

    get backgroundColor(){
        if(this.bg && this.bg.color){
            let color = {type:this.bg.color.type,value:this.bg.color.value}
            if(color.type == "grad"){
                color.value = this.getGradFill(color.value)
            }else if(color.type == "schemeClr"){
                color.value = this.getSolidFill(color)
            }
            return color
        }
    }

    /**
     * @param {import('./presentation')} v
     */
    set presentation(v) {
        this._presationXML = v
        if(this.next){
            this.next.presentation = v
        }
    }

    get presentation() {
        return this._presationXML
    }


    /**
     * @param {import('./theme')} v
     */
    set theme(v) {
        this._theme = v

        if(this.next){
            this.next.theme = this.theme
        }
    }

    get theme() {
        return this._theme
    }

    /**
     * @param {import('./xml-rels')} v
     */
    set rel(v) {
        this.relxml = v
    }

    get rel() {
        return this.relxml
    }

    parseElements(){
        let elements = this.elements
        if(this.type != "slide"){
            elements = this.viewElements
        }
        return elements.map(sp=>{
            if(sp.tag == "p:sp"){
                return this.parseSp(sp)
            }else if(sp.tag == "p:pic"){
                return this.parsePic(sp)
            }else if(sp.tag == "p:grpSp"){
                return this.parseGrp(sp)
            }else if(sp.tag == "p:graphicFrame"){
                return this.parseGraphic(sp)
            }
        }).filter(i=>!!i)
    }

    /**
     * @param {BaseSlide} v
     */
    set next(v){
        this._next = v
    }

    get next(){
        return this._next
    }

    /**
     * @param {import('./slide-mater')} v
     */
    set master(v) {
        this.materxml = v

        if(this.next){
            this.next.master = v
        }
    }

    get master() {
        return this.materxml
    }

    /**
     * @param {Sp} sp 
     */
    parseTxBody(sp){
        if(!sp.txBody){
            return
        }
        let fontSize = this.getTextSize(sp)
        // if (fontSize) {
        //     container.fontSize = fontSize
        // }
        let titleColor = this.getSolidFill(this.getTitleColor())
        return sp.txBody.pList.map(p => {
            let container = {
                children: p.rList.map(r => {
                    

                    let fontFamily = r.fontFamlily
                    if (fontFamily && fontFamily.indexOf('+') == 0) {
                        fontFamily = this.theme.fontScheme.getFont(fontFamily)
                    }

                    if(sp.type){
                        if(!fontFamily){
                            fontFamily = this.master && this.master.getTextFontOfType(sp.type)
                        }
                        if (!fontFamily) {
                            fontFamily = this.theme.fontScheme.getFontByType(sp.type)
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

                    let json = {
                        type: "span",
                        value: r.text,
                        bold: r.rPr && r.rPr.bold,
                        italic: r.rPr && r.rPr.italic,
                        underline: r.rPr && r.rPr.underline,
                        strike: r.rPr && r.rPr.strike,
                        link: r.rPr && r.rPr.link
                        // valign:this.getTextVerticalAlign(r),
                    }

                    json.size = r.fontSize || fontSize

                    if(r.rPr && r.rPr.baseline){
                        json.baseline = r.rPr.baseline
                        if(json.size){
                            json.size = json.size * (100 - json.baseline) / 100
                        }
                    }


                    if(fontFamily){
                        json.fontFamily = fontFamily
                    }

                    if(color){
                        json.color = color
                    }

                    if(r.rPr && r.rPr.highlight){
                        json.highlight = this.getSolidFill(r.rPr.highlight)
                    }

                    return json
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
                    if(sp.type){
                        container.bullet.color = this.getBulletColor(sp)
                    }
                }
            }
            // container.lnPt = p.lineSpacePercent || this.master.getLineSpacePercent(type)

            if ((sp.type == "ctrTitle" || sp.type == "title") && titleColor) {
                container.color = titleColor
            }

            if(sp.type == "sldNum" && p.isSlideNum){
                container.isSlideNum = true
            }

            if(p.align){
                container.algn = p.align
            }

            if(p.pPr && p.pPr.marL){
                container.marL = p.pPr.marL
            }

            if(p.pPr && p.pPr.indent){
                container.indent = p.pPr.indent
            }

            return container
        })
    }

    /**
     * @param {Sp} sp 
     */
    parseSp(sp) {

        let container = {
            type: "container",
            valign: sp.txBody && sp.txBody.anchor,
            padding:sp.txBody && sp.txBody.padding,
            id:sp.id
        }

        let xfrm = this.getXfrm(sp)

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

      
        if (sp.fill) {
            if(sp.fill.type == "grad"){
                container.fill = {
                    type:sp.fill.type,
                    value:this.getGradFill(sp.fill.value)
                }
            }else{
                container.fill = {
                    type:sp.fill.type,
                    value:this.getSolidFill(sp.fill.value)
                }
            }
            
        }

        if(sp.line){
            container.line = {
                color:sp.line.color && this.getSolidFill(sp.line.color),
                round:sp.line.round,
                prstDash:sp.line.prstDash,
                width:sp.line.width
            }
        }

       

        let color = this.getTextColor(sp)
        if (color) {
            container.color = this.getSolidFill(color)
        }

        let text = this.parseTxBody(sp)
    
        if (text) {
            container.text = text
        }

        return container

    }

    /**
     * @param {Pic} pic 
     */
    parsePic(pic) {

        let item = {
            src: this.rel.getRelationById(pic.embed),
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
    parseGrp(gp){
        let container = {
            children: [...gp.shapes.map(sp => {
                return this.parseSp(sp)
            }),...gp.pics.map(sp=>{
                return this.parsePic(sp)
            }),...gp.groupShapes.map(sp=>this.parseGrp(sp))],
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
                                body:this.parseTxBody(tc),
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

    getGradFill(grad){
        return grad.map(c=>{
            let obj = {pos:c.pos}
            obj.color = this.getSolidFill(c.color)
            return obj
        }).filter(c=>!!c.color)
    }


    /**
     * @returns {Sp}
     */
    getPlaceholder(idx,type){
        if(!idx && !type){
            return
        }
       
        let finded = this.placeholders.find(sp=>{
            if(idx){
                return sp.idx == idx
            }
            return sp.type == type
        })

        return finded

    }

    /**
     * @param {Sp} sp 
     */
    getXfrm(sp){

        if(sp && sp.xfrm){
            return sp.xfrm
        }
    
        if(this.next){
            return this.next.getXfrm(this.getPlaceholder(sp))
        }
       
    }


    /**
     * @param {Sp} sp 
     */
    getTextSize(sp){
      
        let fnt = null
        let style = this.getTxStyle(sp)
        if(style){
            fnt = style.getSize('0')
        }
        if(fnt){
            return fnt
        }
        if(this.next){
            return this.next.getTextSize(sp)
        }
    }

    /**
     * @param {Sp} sp 
     */
    getTextColor(sp){
        
        let color = null


        let style = this.getTxStyle(sp)
        if(style){
            color = style.getColor('0')
        }
        if(color){
            return color
        }
        if(this.next){
            return this.next.getTextColor(sp)
        }
    }

    getTitleColor(){
        if(this.type != "master"){
            return this.master.getTitleColor()
        }
    }

 
    getTxStyle({type,idx}){
        if(!type){
            return
        }
        let finded = this.getPlaceholder(idx,type)
        return finded && finded.txBody && finded.txBody.textStyle
    }

    /**
     * @param {Sp} sp 
     */
    getBulletColor(sp){
        let style = this.getTxStyle(sp)
        let color = null
        if(style){
            color = style.getBulletColor('0')
        }
        if(color){
            return color
        }
        if(this.next){
            return this.next.getBulletColor(sp)
        }
    }
}