const XElement = require('../../xelement')

/**
 * 封装类,检测 srgbClr | sysClr | schemeClr | scrgbClr | prstClr | hslClr
 */
module.exports = class Color {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        let srgbClr = node.getSingle('a:srgbClr')
        let schemeClr = node.getSingle('a:schemeClr')

        /**
         * @param {XElement} item
         */
        const getAttrs = item => {
            let shade = item.getSingle('a:shade')
            if (shade) {
                /**
                 * percent
                 */
                this.shade = +shade.attributes.val / 1000
            }
            let lumMod = item.getSingle('a:lumMod')
            if (lumMod) {
                this.lumMod = +lumMod.attributes.val / 1000
            }
            let lumOff = item.getSingle('a:lumOff')
            if (lumOff) {
                this.lumOff = +lumOff.attributes.val / 1000
            }
            let alpha = item.getSingle('a:alpha')
            if (alpha) {
                this.alpha = +alpha.attributes.val / 1000
            }

            let tint = item.getSingle('a:tint')
            if (tint) {
                this.tint = +tint.attributes.val / 1000
            }
        }

        if (srgbClr) {
            /**
             * @type {"srgbClr"|"schemeClr"}
             */
            this.type = 'srgbClr'
            this.value = srgbClr.attributes.val
            getAttrs(srgbClr)
        } else if (schemeClr) {
            this.type = 'schemeClr'
            this.value = schemeClr.attributes.val
            getAttrs(schemeClr)
        }
    }

    toJSON() {
        return {
            type: this.type,
            value: this.value,
            shade: this.shade,
            lumMod: this.lumMod,
            alpha: this.alpha,
            lumOff: this.lumOff,
            tint: this.tint
        }
    }
}
