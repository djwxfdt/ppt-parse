
/**
 *
 * @typedef {import('../base-slide')} BaseSlide
 * @typedef {import('./elements/a-pPr')} PPr
 * @typedef {import('./elements/a-rpr.js')} RPr
 */

/**
 * @param {import('./elements/p-sp')} sp
 * @returns {(self:BaseSlide)=>import('./elements/a-xfrm')}
 */
module.exports.getXfrm = (sp) => self => {
    let params = { idx: sp.idx, type: sp.type }

    while (self) {
        if (sp && sp.xfrm) {
            return sp.xfrm
        }
        if (self.next) {
            sp = self.next.getPlaceholder(params)
        }
        self = self.next
    }
}

/**
 * @param {import('./elements/p-sp')} sp
 */
module.exports.getPrstGeom = (sp) => self => {
    let params = { idx: sp.idx, type: sp.type }

    while (self) {
        if (sp && sp.prstGeom) {
            return sp.prstGeom
        }
        if (self.next) {
            sp = self.next.getPlaceholder(params)
        }
        self = self.next
    }
}

/**
 * @param {import('./elements/p-sp')} sp
 */
module.exports.getFill = sp => self => {
    let params = { idx: sp.idx, type: sp.type }

    while (self) {
        if (sp && sp.fill) {
            return sp.fill
        }
        if (self.next) {
            sp = self.next.getPlaceholder(params)
        }
        self = self.next
    }
}

/**
 * @param {import('./elements/p-sp')} sp
 */
module.exports.getLine = sp => self => {
    let params = { idx: sp.idx, type: sp.type }

    while (self) {
        if (sp && sp.line) {
            return sp.line
        }
        if (self.next) {
            sp = self.next.getPlaceholder(params)
        }
        self = self.next
    }
}

/**
 * @param {import('./elements/p-sp')} sp
 * @returns {(self:BaseSlide)=>any}
 */
const getStyle = (sp, key, lvl = '0') => self => {
    let params = { idx: sp.idx, type: sp.type }
    const master = self.master

    while (self) {
        let value = null
        const style = self.getTxStyle(params)
        if (style) {
            value = style.getValue(key, '0')
        }
        if (value) {
            return value
        }
        self = self.next
    }

    const txStyle = master.getStyleFromTxStyles(params.type)
    const value = txStyle && txStyle.getValue(key, lvl)
    if (value) {
        return value
    }
}

/**
 * @param {import('./elements/p-sp')} sp
 * @returns {(self:BaseSlide)=>number}
 */
module.exports.getTextColor = (sp, lvl = '0') => self => getStyle(sp, 'color', lvl)(self)

/**
 * 逻辑是先取得自身的显式属性，再获取lstStyle的属性，再循环获取上一层lstStyle的属性，最后获取txStyles的属性
 * @param {import('./elements/p-sp')} sp
 * @param {{sz,color,char}} bullet
 * @returns {(self:BaseSlide)=>{sz,color,char}}
 */
module.exports.getBullet = (sp, bullet, lvl = '0') => self => {
    let params = { idx: sp.idx, type: sp.type }
    const master = self.master
    let bullets = [bullet]
    while (self) {
        let value = null
        const style = self.getTxStyle(params)
        if (style) {
            value = style.getBullet('0')
        }
        bullets.push(value)
        self = self.next
    }
    const txStyle = master.getStyleFromTxStyles(params.type)
    const value = txStyle && txStyle.getBullet(lvl)
    bullets.push(value)
    bullets = bullets.filter(i => !!i)

    if (bullets.length) {
        bullet = bullets.reduce((p, c) => {
            p.sz = p.sz || c.sz
            p.color = p.color || c.color
            p.char = p.char || c.char
            return p
        }, {})
        if (!bullet.char) {
            return null
        }
        return bullet
    }
    return null
}

/**
 * @param {import('./elements/p-sp')} sp
 * @param {PPr} ppr
 * @returns {(self:BaseSlide)=>PPr}
 */
module.exports.getPPr = (sp, ppr, lvl = '0') => self => {
    let params = { idx: sp.idx, type: sp.type }
    const master = self.master
    let pprs = [ppr]
    while (self) {
        let value = null
        const style = self.getTxStyle(params)
        if (style) {
            value = style.find(lvl)
        }
        pprs.push(value)
        self = self.next
    }
    const txStyle = master.getStyleFromTxStyles(params.type)
    const value = txStyle && txStyle.find(lvl)
    pprs.push(value)
    pprs = pprs.filter(i => !!i)
    if (pprs.length) {
        ppr = pprs.reduce((p, c) => {
            let obj = c.toJSON()
            for (let k in obj) {
                if (p[k] == undefined) {
                    p[k] = obj[k]
                }
            }
            return p
        }, {})
        return ppr
    }
    return null
}

/**
 * @param {import('./elements/p-sp')} sp
 * @returns {(self:BaseSlide)=>RPr}
 */
module.exports.getDefRPr = (sp, lvl = '0') => self => {
    let params = { idx: sp.idx, type: sp.type }
    const master = self.master
    /**
     * @type {Array<RPr>}
     */
    let rprs = []
    while (self) {
        let value = null
        const style = self.getTxStyle(params)
        if (style) {
            value = style.find(lvl)
        }
        rprs.push(value && value.defRpr)
        self = self.next
    }
    const txStyle = master.getStyleFromTxStyles(params.type)
    const value = txStyle && txStyle.find(lvl)
    rprs.push(value && value.defRpr)
    rprs = rprs.filter(i => !!i)
    if (rprs.length) {
        let rpr = rprs.reduce((p, c) => {
            let obj = c.toJSON()
            for (let k in obj) {
                if (p[k] == undefined) {
                    p[k] = obj[k]
                }
            }
            return p
        }, {})
        return rpr
    }
    return null
}

/**
 * @param {import('./elements/p-sp')} sp
 * @returns {(self:BaseSlide)=>{anchor:string,padding:any}}
 */
module.exports.getTxBodyPr = (sp) => self => {
    let params = { idx: sp.idx, type: sp.type }
    const list = []

    const res = {}
    while (self) {
        const bodyPr = sp && sp.txBody && sp.txBody.bodyPr
        if (bodyPr) {
            list.push(bodyPr)
        }
        if (self.next) {
            sp = self.next.getPlaceholder(params)
        }
        self = self.next
    }

    for (const pr of list) {
        if (!res.anchor) {
            res.anchor = pr.anchor
        }
        if (!res.padding) {
            res.padding = pr.padding
        }
    }

    return res
}

/**
 * @param {import('./elements/p-sp')} sp
 * @returns {(self:BaseSlide)=>string}
 */
module.exports.getTypeface = (sp, lvl = '0') => self => {
    let typeface = getStyle(sp, 'typeface', '0')(self)
    if (!typeface) {
        typeface = self.theme.fontScheme.getFontByType(sp.type || 'other')
    }
    return typeface
}
