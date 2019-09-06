const { searchXML } = require('./utils')

const XElement = require('./xelement')

const ShapeTree = require('./components/ShapeTree')

const Sp = require('./components/elements/p:sp')
const Pic = require('./components/elements/p:pic')


class SlideXML {
    constructor(xml) {

        this.xml = XElement.init(xml).get('p:sld')

        // this.shapes = this.xml.selectFirst(['p:cSld', 'p:spTree'])

        this.shapes = this.xml.selectArray(['p:cSld', 'p:spTree', 'p:sp']).map(sp => ShapeTree.createSp(sp))

        this.pics = this.xml.selectArray(['p:cSld', 'p:spTree', 'p:pic']).map(sp => ShapeTree.createPic(sp))

    }

    get nodes() {
        // this.shapes.

        if (this._json) {
            return this._json
        }

        let obj = {
            background: this.background,
            blocks: []
        }

        let arry = []

        let pics = [...this.pics, ...this.layout.pics]

        this.shapes.map(sp => {
            let obj = this.parseSp(sp)
            arry.push(obj)
        })

        pics.map(sp => {
            arry.push(this.parsePic(sp))
        })

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

        this.pics.filter(p=>p.embed).map(p=>{
            if(!p.src){
                p.src = this.rel.getRelationById(p.embed)
            }
            return p
        })
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
    parsePic(pic) {

        let item = {
            src: pic.src,
            type: "image"
        }

        if(pic.spPr && pic.spPr.xfrm){
            item.position = pic.spPr.xfrm.off
            item.size  = {
                width: pic.spPr.xfrm.ext.cx,
                height: pic.spPr.xfrm.ext.cy,
            }
        }

        return item
    }

    /**
     * 
     * @param {Sp} sp 
     */
    parseSp(sp) {
        
        let type = sp.type

        /**
         * @type{XElement}
         */
        let masterSp = null
        let layoutSp = masterSp

        if (type) {
            masterSp = this.master.tables.typeTable[type]
            layoutSp = this.layout.tables.typeTable[type]
        }

        let xfrmLayout = layoutSp ? layoutSp.selectFirst(['p:spPr', 'a:xfrm']) : null
        // let shpType = node.selectFirst(['p:spPr', 'a:prstGeom', 'attrs', 'prst'])
        // let custShapType = node.selectFirst(['p:spPr', 'a:custGeom'])

        let container = {
            type: "container",
            // valign: this.getVerticalAlign(node)
        }

        if (sp.xfrm) {
            container.position = sp.xfrm.off
            container.size = {
                width: sp.xfrm.ext.cx,
                height: sp.xfrm.ext.cy,
            }
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

        let text = null
        let titleColor = this.master.titleColor
        if (sp.txBody && sp.txBody.pList) {
            text = sp.txBody.pList.map(p => {
                let container = {
                    children: p.rList.map(r => {
                        let sz = r.fontSize || this.layout.getTextSizeOfType(type) || this.master.textStyles.getTextSizeOfType(type)
                        if (r.rPr && r.rPr.baseline && !isNaN(sz)) {
                            sz -= 10
                        }
                        if (!isNaN(sz)) {
                            sz = sz / 3 * 4
                        }

                        let fontFamily = r.fontFamlily
                        if (fontFamily && fontFamily.indexOf('+') == 0) {
                            fontFamily = this.theme.getFontTheme(fontFamily)
                        }
                        if (!fontFamily) {
                            fontFamily = this.theme.getFontFamily(sp.type)
                        }

                        return {
                            type: "span",
                            value: r.text,
                            size: sz,
                            color: r.solidFill,
                            fontFamily,
                            // valign:this.getTextVerticalAlign(r),
                            // decoration:this.getTextDecoration(r),
                            // fontStyle:this.getTextStyle(r)
                        }
                    })
                }

                if (type == "ctrTitle" && titleColor) {
                    container.color = titleColor
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
     * @param {XElement} node 
     */
    getFontSizeOfNode(node, type) {
        let size = node.selectFirst(["a:rPr", "attrs", "sz"])
        if (isNaN(size)) {
            size = this.layout.getSizeOfType(type)
            if (isNaN(size)) {
                size = this.master.textStyles.getTextSizeOfType(type)
                if (size) {
                    size *= 100
                }
            }
        }
        if (size) {
            size = +size / 100
        }

        let baseline = node.selectFirst(['a:rPr', 'attrs', 'baseline'])
        if (baseline && !isNaN(size)) {
            size -= 10
        }
        if (!isNaN(size)) {
            size = size / 3 * 4
        }
        return size
    }

    /**
     * 
     * @param {XElement} node 
     * @param {*} type 
     */
    getFontColorOfNode(node, type) {
        let fill = node.selectFirst(['a:rPr', 'a:solidFill'])
        let color
        if (!fill) {
            // let colorMap = this.master.getColorMap("tx1")

            return color
        }

        color = fill.selectFirst(['a:srgbClr', 'attrs', 'val'])
        if (color) {
            return color
        }

        color = fill.selectFirst(['a:schemeClr', 'attrs', 'val'])
        if (color) {
            return color
        }
    }

    /**
    * 
    * @param {XElement} node 
    * @param {*} type 
    */
    getFontFamilyOfNode(node, type) {
        let family = node.selectFirst(['a:rPr', 'a:latin', 'attrs', 'typeface'])
        if (family && family.indexOf('+') == 0) {
            family = this.theme.getFontTheme(family)
        }
        if (!family) {
            family = this.theme.getFontFamily(type)
        }
        return family
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
     * @param {XElement} node 
     */
    getTextDecoration(node) {
        let underline = node.selectFirst(["a:rPr", "attrs", "u"])
        let strike = node.selectFirst(["a:rPr", "attrs", "strike"])
        if (underline && strike) {
            return "underline line-through"
        }
        if (underline) {
            return "underline"
        }
        if (strike) {
            return "line-through"
        }
    }

    /**
     * @param {XElement} node 
     */
    getTextStyle(node) {
        return node.selectFirst(["a:rPr", "attrs", "i"]) ? "italic" : undefined
    }


    /**
     * @param {XElement} shape 
     * @param {*} type 
     */
    getHorizontalAlign(shape, type) {
        let align = shape.selectFirst(['a:pPr', 'attrs', 'algn'])
        switch (align) {
            case "ctr": {
                return "center"
            }
            case "r": {
                return "right"
            }
            default: {
                return "left"
            }
        }
    }

    /**
     * @param {XElement} shape 
     * @param {*} type 
     */
    getVerticalAlign(shape, type) {
        let anchor = shape.selectFirst(['p:txBody', 'a:bodyPr', 'attrs', 'anchor'])
        switch (anchor) {
            case "ctr": {
                return "middle"
            }
            case "b": {
                return "bottom"
            }
            default: {
                return "top"
            }
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