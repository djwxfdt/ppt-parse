const XElement = require('../../xelement')

class MFont {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        const ea = node.getSingle('a:ea')
        if (ea) {
            /**
             * This element specifies that an East Asian font be used for a specific run of text. This font will be specified with a typeface attribute much like the others but will specifically be classified as an East Asian font.
             */
            this.ea = ea.attributes.typeface
        }

        const latin = node.getSingle('a:latin')
        if (latin) {
            /**
             * This element specifies that a Latin font be used for a specific run of text. This font will be specified with a typeface attribute much like the others but will specifically be classified as a Latin font.
             */
            this.lt = latin.attributes.typeface
        }

        const cs = node.getSingle('a:cs')
        if (cs) {
            /**
             * This element specifies that a complex script font be used for a specific run of text. This font will be specified with a typeface attribute much like the others but will specifically be classified as a complex script font.
             */
            this.cs = cs.attributes.typeface
        }

        /**
         * @type {{[key:string]:string}}
         */
        this.fontsMap = {}
        node.selectArray(['a:font']).map(f => {
            this.fontsMap[f.attributes.script] = f.attributes.typeface
        })
    }

    /**
     * @returns {string}
     */
    getFont(key) {
        let f = this[key]
        if (!f) {
            f = this.fontsMap[key]
        }
        return f
    }
}

class FontScheme {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        if (!node) {
            return
        }

        const major = node.getSingle('a:majorFont')
        if (major) {
            this.majorFont = new MFont(major)
        }

        const minor = node.getSingle('a:minorFont')
        if (minor) {
            this.minorFont = new MFont(minor)
        }
    }

    /**
     *
     * @param {string} name
     */
    getFont(name) {
        /**
         * @type {MFont}
         */
        let font = this.minorFont
        let rname = 'lt'

        if (name.indexOf('+mj-') > -1) {
            font = this.majorFont
            rname = name.replace('+mj-', '')
        } else if (name.indexOf('+mn-') > -1) {
            rname = name.replace('+mn-', '')
        }

        if (font && rname) {
            return font.getFont(rname)
        }
    }

    getFontByType(type) {
        switch (type) {
        case 'title':
        case 'subTitle':
        case 'ctrTitle': {
            if (this.majorFont) {
                return this.majorFont.getFont('lt')
            }
        }
        // eslint-disable-next-line no-fallthrough
        case 'body':
        default: {
            if (this.minorFont) {
                return this.minorFont.getFont('lt')
            }
        }
        }
    }
}

module.exports = FontScheme
