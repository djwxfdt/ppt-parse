
/**
 *
 * @typedef {import('../base-slide')} BaseSlide
 */

/**
 * @param {import('./elements/p-sp')} sp
 * @returns {(self:BaseSlide)=>import('./elements/a-xfrm')}
 */
module.exports.getXfrm = (sp) => self => {
    const { idx, type } = sp

    while (self) {
        if (sp && sp.xfrm) {
            return sp.xfrm
        }
        if (self.next) {
            sp = self.next.getPlaceholder(idx, type)
        }
        self = self.next
    }
}

/**
 * @param {import('./elements/p-sp')} sp
 */
module.exports.getPrstGeom = (sp) => self => {
    const { idx, type } = sp

    while (self) {
        if (sp && sp.prstGeom) {
            return sp.prstGeom
        }
        if (self.next) {
            sp = self.next.getPlaceholder(idx, type)
        }
        self = self.next
    }
}

/**
 * @param {import('./elements/p-sp')} sp
 */
module.exports.getFill = sp => self => {
    const { idx, type } = sp

    while (self) {
        if (sp && sp.fill) {
            return sp.fill
        }
        if (self.next) {
            sp = self.next.getPlaceholder(idx, type)
        }
        self = self.next
    }
}

/**
 * @param {import('./elements/p-sp')} sp
 */
module.exports.getLine = sp => self => {
    const { idx, type } = sp

    while (self) {
        if (sp && sp.line) {
            return sp.line
        }
        if (self.next) {
            sp = self.next.getPlaceholder(idx, type)
        }
        self = self.next
    }
}

/**
 * @param {import('./elements/p-sp')} sp
 * @returns {(self:BaseSlide)=>any}
 */
const getStyle = (sp, key, lvl = '0') => self => {
    const { idx, type } = sp
    const master = self.master

    while (self) {
        let value = null
        const style = self.getTxStyle({ idx, type })
        if (style) {
            value = style.getValue(key, '0')
        }
        if (value) {
            return value
        }
        self = self.next
    }

    const txStyle = master.getStyleFromTxStyles(type)
    const value = txStyle && txStyle.getValue(key, lvl)
    if (value) {
        return value
    }
}

/**
 * @param {import('./elements/p-sp')} sp
 * @returns {(self:BaseSlide)=>number}
 */
module.exports.getTextSize = (sp, lvl = '0') => self => getStyle(sp, 'size', lvl)(self)

/**
 * @param {import('./elements/p-sp')} sp
 * @returns {(self:BaseSlide)=>number}
 */
module.exports.getTextColor = (sp, lvl = '0') => self => getStyle(sp, 'color', lvl)(self)

/**
 * @param {import('./elements/p-sp')} sp
 * @returns {(self:BaseSlide)=>number}
 */
module.exports.getBulletColor = (sp, lvl = '0') => self => getStyle(sp, 'bullet', lvl)(self)

/**
 * @param {import('./elements/p-sp')} sp
 * @returns {(self:BaseSlide)=>{anchor:string,padding:any}}
 */
module.exports.getTxBodyPr = (sp) => self => {
    const { idx, type } = sp
    const list = []

    const res = {}
    while (self) {
        const bodyPr = sp && sp.txBody && sp.txBody.bodyPr
        if (bodyPr) {
            list.push(bodyPr)
        }
        if (self.next) {
            sp = self.next.getPlaceholder(idx, type)
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
