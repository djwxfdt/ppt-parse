const { searchXML } = require('./utils')

const XElement = require('./xelement')

const ShapeTree = require('./components/ShapeTree')

const Sp = require('./components/elements/p-sp')
const Pic = require('./components/elements/p-pic')
const GroupSp = require("./components/elements/p-grpSp")

const SlideBg = require("./components/elements/p-bg")


class SlideXML {
    constructor(xml) {

        this.xml = XElement.init(xml)

        // this.shapes = this.xml.selectFirst(['p:cSld', 'p:spTree'])

        this.shapes = this.xml.selectArray(['p:cSld', 'p:spTree', 'p:sp']).map(sp => ShapeTree.createSp(sp))

        this.pics = this.xml.selectArray(['p:cSld', 'p:spTree', 'p:pic']).map(sp => ShapeTree.createPic(sp))

        this.groupShapes = this.xml.selectArray(['p:cSld', 'p:spTree', 'p:grpSp']).map(sp => ShapeTree.createGroupSp(sp))

        let bg = this.xml.selectFirst(['p:cSld',"p:bg"])

        if(bg){
            this.bg = new SlideBg(bg)
        }
    }

    get nodes() {
        // this.shapes.

        if (this._json) {
            return this._json
        }

        let obj = {
            backgroundImage: this.bg && this.bg.imageSrc,
            blocks: [],
            backgroundColor: this.bg && this.bg.color
        }


        let arry = []

        this.layout.viewShapes.map(sp => {
            arry.push(this.parseSp(sp, true))
        })

        this.layout.groupShapes.map(gp=>{
            arry.push(this.parseGrp(gp,true))
        })

        this.layout.pics.map(sp=>arry.push(this.parsePic(sp,true)))

        this.shapes.map(sp => {
            let obj = this.parseSp(sp)
            arry.push(obj)
        })

        this.groupShapes.map(gp => {
            arry.push(this.parseGrp(gp,false))
        })

        

        this.pics.map(sp => {
            arry.push(this.parsePic(sp))
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
     * @param {Sp} sp 
     */
    parseSp(sp, isLayout = false) {

        let type = sp.type


        let container = {
            type: "container",
            valign: sp.txBody && sp.txBody.anchor,
            padding:sp.txBody && sp.txBody.padding
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
            container.fill = sp.solidFill
        }

        let fontSize = (!isLayout && this.layout.getTextSize(sp.idx,sp.type)) || this.master.getTextSizeOfType(type)
        if (fontSize) {
            container.fontSize = fontSize
        }

        let color = (!isLayout && this.layout.getTextColor(sp.idx,sp.type)) || this.master.getTextColorOfType(sp.type)
        if (color) {
            container.color = color
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

        let text = []
        let titleColor = this.master.titleColor
        if (sp.txBody && sp.txBody.pList) {
            text = sp.txBody.pList.map(p => {
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
                        if (!fontFamily) {
                            fontFamily = this.theme.fontScheme.getFontByType(sp.type)
                        }

                        if (fontFamily && this.presentation.isEmbeddeFont(fontFamily)) {
                            fontFamily = undefined
                        }


                        let color = r.solidFill

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
                }
                // container.lnPt = p.lineSpacePercent || this.master.getLineSpacePercent(sp.type)

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

        if (text) {
            container.text = text
        }

        return container

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
}


module.exports = SlideXML