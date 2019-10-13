const XElement = require('./xelement')

const TextStyles = require('./components/text-styles')

const SlideBg = require('./components/elements/p-bg')

const Transition = require('./components/elements/p-transition')

const ShapeTree = require('./components/ShapeTree')

const Sp = require('./components/elements/p-sp')
const Pic = require('./components/elements/p-pic')
const GroupSp = require('./components/elements/p-grpSp')
const GraphicFrame = require('./components/elements/p-graphicFrame')

const Color = require('./components/elements/c-color')

const GradFill = require('./components/elements/a-gradFill')

const { mapFont, applyLumColor, GOOGLE_FONTS } = require('./utils')

const SlideFunctions = require('./components/slide-functions')

module.exports = class BaseSlide {
    constructor(xml) {
        this.xml = XElement.init(xml)

        const spTree = this.xml.selectFirst(['p:cSld', 'p:spTree'])

        this.elements = spTree.children
            .map(el => ShapeTree.createElement(el))
            .filter(e => !!e)

        this.placeholders = this.elements.filter(sp => !!sp.placeholder)

        this.viewElements = this.elements.filter(sp => !sp.placeholder)

        const bg = this.xml.selectFirst(['p:cSld', 'p:bg'])

        if (bg) {
            this.bg = new SlideBg(bg)
        }

        const trans = this.xml.getSingle('p:transition')
        if (trans) {
            this.transition = new Transition(trans)
        }

        this.googleFonts = {}

        /**
         * @type {"slide"|"layout"|"master"}
         */
        this.type = ''
    }

    get backgroundImg() {
        if (this.bg && this.bg.imageEmbed) {
            return this.rel.getRelationById(this.bg.imageEmbed)
        }
    }

    get backgroundColor() {
        const color = {}

        if (this.bg && this.bg.bgRef) {
            const phClr = this.bg.bgRef.value
            const fill = this.theme.getBgFillByIdx(this.bg.bgRef.idx)
            if (fill) {
                if (phClr) {
                    if (fill instanceof GradFill) {
                        fill.list.map(g => {
                            g.value = g.value == 'phClr' ? phClr : g.value
                        })
                    } else {
                        fill.value = phClr
                    }
                }

                color.type = fill.fillType
                color.value = fill
                color.ang = fill.ang
            }
        }

        if (!color.type && this.bg && this.bg.color) {
            color.type = this.bg.color.fillType
            color.value = this.bg.color
            color.ang = this.bg.color.ang
        }

        if (color.type) {
            if (color.type == 'grad') {
                color.value = this.getGradFill(color.value)
            } else if (color.type == 'solid') {
                color.value = this.getSolidFill(color.value)
            } else {
                return null
            }
            return color
        }
    }

    /**
     * @param {import('./presentation')} v
     */
    set presentation(v) {
        this._presationXML = v
        if (this.next) {
            this.next.presentation = v
        }
    }

    get presentation() {
        return this._presationXML
    }

    set pageIndex(v) {
        this._pageIndex = v
        if (this.next) {
            this.next.pageIndex = v
        }
    }

    /**
     * @param {Array<import("./vml-drawing")>} v
     */
    set vmls(v) {
        this._vmls = v
        if (this.next) {
            this.next.vmls = v
        }
    }

    /**
     * @param {import('./theme')} v
     */
    set theme(v) {
        this._theme = v

        if (this.next) {
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

    parseElements() {
        let elements = this.elements
        if (this.type != 'slide') {
            elements = this.viewElements
        }
        return this._parseElements(elements, true)
    }

    _parseElements(elements, _top = false) {
        return elements
            .map(sp => {
                if (sp.tag == 'p:sp') {
                    return this.parseSp(sp)
                } else if (sp.tag == 'p:pic') {
                    return this.parsePic(sp)
                } else if (sp.tag == 'p:grpSp') {
                    const grp = this.parseGrp(sp)
                    return _top ? this.reSizeGroup(grp) : grp
                } else if (sp.tag == 'p:graphicFrame') {
                    return this.parseGraphic(sp)
                }
            })
            .filter(i => !!i)
    }

    /**
     * @param {BaseSlide} v
     */
    set next(v) {
        this._next = v
    }

    get next() {
        return this._next
    }

    /**
     * @param {import('./slide-master')} v
     */
    set master(v) {
        this.materxml = v

        if (this.next) {
            this.next.master = v
        }
    }

    get master() {
        return this.materxml
    }

    /**
     * @param {Sp} sp
     */
    parseTxBody(sp) {
        if (!sp.txBody) {
            return
        }
        return sp.txBody.pList.map(p => {
            let defRpr = SlideFunctions.getDefRPr(sp, p.lvl)(this) || {}
            let ppr = SlideFunctions.getPPr(sp, p.pPr, p.lvl)(this) || {}
            if (defRpr.solidFill) {
                defRpr.color = this.getSolidFill(defRpr.solidFill)
                delete defRpr.solidFill
            }

            const container = {
                children: p.rList
                    .map(r => {
                        if (!r.text || r.text.length == '0') {
                            return
                        }

                        let fontFamily = r.fontFamlily || defRpr.typeface
                        if (fontFamily && fontFamily.indexOf('+') == 0) {
                            fontFamily = this.theme.fontScheme.getFont(
                                fontFamily
                            )
                        }

                        if (
                            fontFamily &&
                                this.presentation.isEmbeddeFont(fontFamily)
                        ) {
                            // fontFamily = undefined
                        }

                        if (fontFamily) {
                            if (GOOGLE_FONTS[fontFamily]) {
                                fontFamily = GOOGLE_FONTS[fontFamily]
                                this.googleFonts[fontFamily] = true
                            }
                            fontFamily = mapFont(fontFamily)
                        }

                        let color = this.getSolidFill(r.solidFill)

                        if (r.rPr && r.rPr.link) {
                            color =
                                    this.getSolidFill({
                                        type: 'schemeClr',
                                        value: 'hlink'
                                    }) || color
                        }

                        const json = {
                            type: 'span',
                            value: r.text,
                            bold: r.rPr && r.rPr.bold,
                            italic: r.rPr && r.rPr.italic,
                            underline: r.rPr && r.rPr.underline,
                            strike: r.rPr && r.rPr.strike,
                            link: r.rPr && r.rPr.link
                            // valign:this.getTextVerticalAlign(r),
                        }

                        json.size = r.fontSize || defRpr.size

                        if (r.rPr && r.rPr.baseline) {
                            json.baseline = r.rPr.baseline
                            if (json.size) {
                                json.size =
                                        (json.size * (100 - json.baseline)) /
                                        100
                            }
                        }

                        if (
                            r.rPr &&
                                r.rPr.effectLst &&
                                r.rPr.effectLst.outerShaw
                        ) {
                            const shaw = r.rPr.effectLst.outerShaw
                            json.outerShadow = {
                                color: this.getSolidFill(shaw),
                                direction: shaw.dir,
                                blurRad: shaw.blurRad,
                                dist: shaw.dist
                            }
                        }

                        if (fontFamily) {
                            json.fontFamily = fontFamily
                        }

                        if (color) {
                            json.color = color
                        }

                        if (r.rPr && r.rPr.highlight) {
                            json.highlight = this.getSolidFill(
                                r.rPr.highlight
                            )
                        }

                        return json
                    })
                    .filter(t => t)
            }

            if (sp.type != 'sldNum' && container.children.length == 0) {
                return
            }

            Object.assign(container, ppr, defRpr)

            if (!p.bullNone) {
                if (sp.type == 'body' || (p.hasBullet && sp.type != 'body')) {
                    let bullet = SlideFunctions.getBullet(sp, p.bullet, p.lvl)(this)
                    if (bullet) {
                        container.bullet = bullet
                    }
                }
            }
            if (sp.type == 'sldNum' && p.isSlideNum) {
                container.isSlideNum = true
            }
            return container
        })
            .filter(i => !!i)
    }

    /**
     * @param {Sp} sp
     * @returns {{type:"container",size:{width,height},position:{x,y}}}
     */
    parseSp(sp) {
        const txBodyPr = SlideFunctions.getTxBodyPr(sp)(this)

        const container = {
            type: 'container',
            valign: txBodyPr.anchor,
            padding: txBodyPr.padding,
            id: sp.id
        }

        const xfrm = SlideFunctions.getXfrm(sp)(this)

        if (xfrm) {
            container.position = xfrm.off
            container.size = {
                width: xfrm.ext.cx,
                height: xfrm.ext.cy
            }
            if (xfrm.rot) {
                container.rot = xfrm.rot
            }
        }

        if (sp.custGeom) {
            container.svgs = sp.custGeom.paths
        }

        const prstShape = SlideFunctions.getPrstGeom(sp)(this)
        if (prstShape) {
            container.prstShape = prstShape
        }

        const fill = SlideFunctions.getFill(sp)(this)
        if (fill) {
            if (fill.type == 'grad') {
                container.fill = {
                    type: fill.type,
                    value: this.getGradFill(fill.value)
                }
            } else {
                container.fill = {
                    type: fill.type,
                    value: this.getSolidFill(fill.value)
                }
            }
        }

        const line = SlideFunctions.getLine(sp)(this)
        if (line && line.color) {
            container.line = {
                color: this.getSolidFill(line.color),
                round: line.round,
                prstDash: line.prstDash,
                width: line.width
            }
        }

        const color = this.getSolidFill(SlideFunctions.getTextColor(sp)(this))
        if (color) {
            container.color = color
        }

        const text = this.parseTxBody(sp)

        if (text) {
            container.text = text
        }

        return container
    }

    /**
     * @param {Pic} pic
     * @returns {{type:"image",size:{width,height},position:{x,y}}}
     */
    parsePic(pic) {
        const item = {
            src: this.rel.getRelationById(pic.embed),
            type: 'image'
        }

        const xfrm = pic.spPr && pic.spPr.xfrm
        if (xfrm) {
            item.position = xfrm.off
            item.size = {
                width: xfrm.ext.cx,
                height: xfrm.ext.cy
            }
            if (xfrm.rot) {
                item.rot = xfrm.rot
            }
        }

        return item
    }

    /**
     * @param {GroupSp} gp
     */
    parseGrp(gp) {
        const container = {
            children: this._parseElements(gp.elements),
            type: 'group'
        }

        if (gp.xfrm) {
            container.position = gp.xfrm.off
            container.size = {
                width: gp.xfrm.ext.cx,
                height: gp.xfrm.ext.cy
            }
            if (gp.xfrm.rot) {
                container.rot = gp.xfrm.rot
            }
            if (gp.xfrm.chOff) {
                container.chOff = gp.xfrm.chOff
            }
            if (gp.xfrm.chExt) {
                container.chExt = gp.xfrm.chExt
            }
        }

        return container
    }

    /**
     *
     * @param {*} sp
     * @param {*} ox 子偏移
     * @param {*} oy 子偏移
     * @param {*} scaleX
     * @param {*} scaleY
     */
    reSizeSp(sp, ox, oy, scaleX, scaleY) {
        const rx = (sp.position.x - ox) * scaleX
        const ry = (sp.position.y - oy) * scaleY
        const rw = sp.size.width * scaleY
        const rh = sp.size.height * scaleY
        if (sp.type == 'group') {
            scaleX = rw / sp.chExt.width
            scaleY = rh / sp.chExt.height
            sp.children = sp.children.map(s => {
                return this.reSizeSp(s, sp.chOff.x, sp.chOff.y, scaleX, scaleY)
            })
        }
        sp.position = { x: rx, y: ry }
        sp.size = { width: rw, height: rh }
        return sp
    }

    reSizeGroup(grp) {
        const scaleX = grp.size.width / grp.chExt.width
        const scaleY = grp.size.height / grp.chExt.height

        grp.children = grp.children.map(sp => {
            return this.reSizeSp(sp, grp.chOff.x, grp.chOff.y, scaleX, scaleY)
        })
        return grp
    }

    /**
     *
     * @param {GraphicFrame} frame
     */
    parseGraphic(frame) {
        const item = {
            type: frame.graphic.type
        }

        if (frame.xfrm) {
            item.position = frame.xfrm.off
            item.size = {
                width: frame.xfrm.ext.cx,
                height: frame.xfrm.ext.cy
            }
            if (frame.xfrm.rot) {
                item.rot = frame.xfrm.rot
            }
        }

        if (item.type == 'table') {
            const table = frame.graphic.table
            item.table = {
                cols: table.gridCols,
                trs: table.trs.map(tr => {
                    return {
                        tcs: tr.tcs.map(tc => {
                            const content = {
                                body: this.parseTxBody(tc),
                                ln: tc.tcPr && tc.tcPr.ln
                            }
                            if (content.ln && content.ln.color) {
                                content.ln.color = this.getSolidFill(
                                    content.ln.color
                                )
                            }
                            return content
                        }),
                        height: tr.height
                    }
                })
            }
        } else if (item.type == 'oleObj') {
            const oleObj = frame.graphic.oleObj
            if (oleObj && oleObj.spid) {
                const vml = this._vmls.find(vml => vml.spid == oleObj.spid)
                if (vml) {
                    item.src = vml.src
                    item.width = vml.width
                    item.height = vml.height
                    item.left = vml.left
                    item.top = vml.top
                    item.imgW = oleObj.imgW
                    item.imgH = oleObj.imgH
                }
            }
        }

        return item
    }

    /**
     *
     * @param {Color} solid
     */
    getSolidFill(solid) {
        if (!solid) {
            return
        }
        let res = solid
        if (solid.toJSON) {
            res = solid.toJSON()
        }
        if (solid.type == 'schemeClr') {
            if (solid.value == 'phClr') {
                res.value = '000'
            } else {
                const k = this.theme.getColor(
                    'a:' + this.master.findSchemeClr(solid.value)
                )
                if (k) {
                    res.value = k
                }
            }
        }
        return applyLumColor(res)
    }

    /**
     *
     * @param {GradFill} grad
     */
    getGradFill(grad) {
        if (!grad) {
            return
        }
        return grad.list
            .map(c => {
                const color = this.getSolidFill(c)
                if (!color) {
                    return {}
                }
                return { pos: c.pos, value: color }
            })
            .filter(c => !!c.value)
    }

    /**
     * @returns {Sp}
     * @param {{type,idx}} params
     */
    getPlaceholder(params) {
        if (!params.idx && !params.type) {
            return
        }

        let finded = this.placeholders.find(sp => sp.type == params.type)

        if (params.idx) {
            finded = this.placeholders.find(sp => sp.idx == params.idx) || finded
        }

        if (finded) {
            if (!params.type) {
                params.type = finded.type
            }
            // params.idx = finded.idx || params.idx
        }

        return finded
    }

    getTitleColor() {
        if (this.type != 'master') {
            return this.master.getTitleColor()
        }
    }

    /**
     * @param {{type,idx}} params
     */
    getTxStyle(params) {
        const finded = this.getPlaceholder(params)
        return finded && finded.txBody && finded.txBody.textStyle
    }
}
