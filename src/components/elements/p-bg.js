const XElement = require('../../xelement')

const BlipFill = require('./p-blipFill')

const SolidFill = require('./a-solidFill')

const GradFill = require('./a-gradFill')

const Color = require('./c-color')

class BgRef extends Color {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        super(node)
        /**
         * The @idx attribute refers to the index of a background fill style or fill style within the presentation's style matrix, defined by the <fmtScheme> element.
         * A value of 0 or 1000 indicates no background,
         * values 1-999 refer to the index of a fill style within the <fillStyleLst> element,
         * and values 1001 and above refer to the index of a background fill style within the <bgFillStyleLst> element. The value 1001 corresponds to the first background fill style, 1002 to the second background fill style, and so on.
         */
        this.idx = +(node.attributes.idx || 0)

        this.fillType = 'solid'
    }
}

/**
 * This element specifies visual effects used to render the slide background. This includes any fill, image, or effects that are to make up the background of the slide.
 */
class BgPr {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        let blipFill = node.getSingle('a:blipFill')
        if (blipFill) {
            this.blipFill = new BlipFill(blipFill)
        }

        let solidFill = node.getSingle('a:solidFill')

        if (solidFill) {
            this.solidFill = new SolidFill(solidFill)
        }

        let gradFill = node.getSingle('a:gradFill')

        if (gradFill) {
            this.gradFill = new GradFill(gradFill)
        }
    }
}

module.exports = class Bg {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        let bgPr = node.getSingle('p:bgPr')
        if (bgPr) {
            this.bgPr = new BgPr(bgPr)
        }

        let bgRef = node.getSingle('p:bgRef')
        if (bgRef) {
            this.bgRef = new BgRef(bgRef)
        }
    }

    get imageEmbed() {
        if (this.bgPr && this.bgPr.blipFill) {
            return this.bgPr.blipFill.embed
        }
    }

    get imageSrc() {
        return this._src
    }

    set imageSrc(v) {
        this._src = v
    }

    get color() {
        if (this.bgPr) {
            return this.bgPr.solidFill || this.bgPr.gradFill
        }

        if (this.bgRef) {
            return this.bgRef
        }
    }
}
