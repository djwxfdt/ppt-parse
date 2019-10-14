const XElement = require('../../xelement')

/**
 * This element specifies the existence of an image (binary large image or picture) and contains a reference to the image data.
 */
class Blip {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.embed = node.attributes['r:embed']
    }
}

/**
 * (Picture Fill)
 * This element specifies the type of picture fill that the picture object will have. Because a picture has a picture fill already by default, it is possible to have two fills specified for a picture object. An example of this is shown below.
 */
module.exports = class BlipFill {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        let blip = node.getSingle('a:blip')
        if (blip) {
            this.blip = new Blip(blip)
        }
    }

    get embed() {
        if (this.blip) {
            return this.blip.embed
        }
    }

    get xfrm() {
        if (this.spPr) {
            return this.spPr.xfrm
        }
    }
}
