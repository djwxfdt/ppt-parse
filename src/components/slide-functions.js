

/**
 * 
 * @typedef {import('../base-slide')} BaseSlide
 */

/**
 * @param {import('./elements/p-sp')} sp 
 * @returns {(self:BaseSlide)=>import('./elements/a-xfrm')}
 */
module.exports.getXfrm = (sp) => self => {
    let { idx, type } = sp

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
 * @returns {(self:BaseSlide)=>any}
 */
const getStyle = (sp,key) => self => {
    let { idx, type } = sp
    let master = self.master
    while (self) {
        let value = null
        let style = self.getTxStyle({ idx, type })
        if (style) {
            value = style.getValue(key,'0')
        }
        if (value) {
            return value
        }
        self = self.next
    }

    let txStyle = master.getStyleFromTxStyles(type )
    let value = txStyle && txStyle.getValue(key,'0')
    if (value) {
        return value
    }
}



/**
 * @param {import('./elements/p-sp')} sp 
 * @returns {(self:BaseSlide)=>number}
 */
module.exports.getTextSize = sp => self => getStyle(sp,"size")(self)


/**
 * @param {import('./elements/p-sp')} sp 
 * @returns {(self:BaseSlide)=>number}
 */
module.exports.getTextColor = (sp) => self => getStyle(sp,"color")(self)


/**
 * @param {import('./elements/p-sp')} sp 
 * @returns {(self:BaseSlide)=>number}
 */
module.exports.getBulletColor = (sp) => self => getStyle(sp,"bullet")(self)