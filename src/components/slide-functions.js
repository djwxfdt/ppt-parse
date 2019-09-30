

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
const getStyle = (sp,key,lvl="0") => self => {
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
    let value = txStyle && txStyle.getValue(key,lvl)
    if (value) {
        return value
    }
}



/**
 * @param {import('./elements/p-sp')} sp 
 * @returns {(self:BaseSlide)=>number}
 */
module.exports.getTextSize = (sp,lvl="0") => self => getStyle(sp,"size",lvl)(self)


/**
 * @param {import('./elements/p-sp')} sp 
 * @returns {(self:BaseSlide)=>number}
 */
module.exports.getTextColor = (sp,lvl="0") => self => getStyle(sp,"color",lvl)(self)


/**
 * @param {import('./elements/p-sp')} sp 
 * @returns {(self:BaseSlide)=>number}
 */
module.exports.getBulletColor = (sp,lvl="0") => self => getStyle(sp,"bullet",lvl)(self)


/**
 * @param {import('./elements/p-sp')} sp 
 * @returns {(self:BaseSlide)=>{anchor:string,padding:any}}
 */
module.exports.getTxBodyPr = (sp) => self => {
    let { idx, type } = sp
    let list = []
    
    let res = {}
    while(self){
        let bodyPr = sp && sp.txBody && sp.txBody.bodyPr
        if(bodyPr){
            list.push(bodyPr)
        }
        if (self.next) {
            sp = self.next.getPlaceholder(idx, type)
        }
        self = self.next
    }

    for(let pr of list){
        if(!res.anchor){
            res.anchor = pr.anchor
        }
        if(!res.padding){
            res.padding = pr.padding
        }
    }

    return res
}