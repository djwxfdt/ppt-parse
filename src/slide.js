const { searchXML } = require('./utils')

const XElement = require('./xelement')

const ShapeTree = require('./components/ShapeTree')

const Sp = require('./components/elements/p-sp')
const Pic = require('./components/elements/p-pic')


class SlideXML {
    constructor(xml) {

        this.xml = XElement.init(xml).get('p:sld')

        // this.shapes = this.xml.selectFirst(['p:cSld', 'p:spTree'])

        this.shapes = this.xml.selectArray(['p:cSld', 'p:spTree', 'p:sp']).map(sp => ShapeTree.createSp(sp))

        this.pics = this.xml.selectArray(['p:cSld', 'p:spTree', 'p:pic']).map(sp => ShapeTree.createPic(sp))

        this.groupShapes = this.xml.selectArray(['p:cSld', 'p:spTree', 'p:grpSp']).map(sp => ShapeTree.createGroupSp(sp))

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

        this.layout.viewShapes.map(sp => {
            arry.push(this.parseSp(sp, true))
        })

        this.shapes.map(sp => {
            let obj = this.parseSp(sp)
            arry.push(obj)
        })

        this.groupShapes.map(gp => {

            let container = {
                children: gp.shapes.map(sp => {
                    return this.parseSp(sp)
                }),
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
            }

            arry.push(container)
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

        this.pics.filter(p => p.embed).map(p => {
            if (!p.src) {
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
     * @param {Sp} sp 
     */
    parseSp(sp, isLayout = false) {

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

        // let shpType = node.selectFirst(['p:spPr', 'a:prstGeom', 'attrs', 'prst'])
        // let custShapType = node.selectFirst(['p:spPr', 'a:custGeom'])

        let container = {
            type: "container",
            valign: sp.txBody.anchor
        }

        if (sp.xfrm) {
            container.position = sp.xfrm.off
            container.size = {
                width: sp.xfrm.ext.cx,
                height: sp.xfrm.ext.cy,
            }
            if (sp.xfrm.rot) {
                container.rot = sp.xfrm.rot
            }
        }

        if (sp.custGeom) {
            container.svgs = sp.custGeom.paths
        }

        if (sp.solidFill) {
            container.fill = sp.solidFill
        }

        let fontSize = (!isLayout && this.layout.getTextSizeOfType(type)) || this.master.getTextSizeOfType(type)
        if (fontSize) {
            container.fontSize = fontSize
        }

        let color = (!isLayout && this.layout.getTextColorOfType(sp.type)) || this.master.getTextColorOfType(sp.type)
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

        let text = null
        let titleColor = this.master.titleColor
        if (sp.txBody && sp.txBody.pList) {
            text = sp.txBody.pList.map(p => {
                let container = {
                    children: p.rList.map(r => {
                        if (!r.text) {
                            return
                        }
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
                            // fontStyle:this.getTextStyle(r)
                        }
                    }).filter(t => t)
                }

                if (p.lineSpacePercent) {
                    container.lnPt = p.lineSpacePercent
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