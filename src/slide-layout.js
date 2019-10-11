const XElement = require('./xelement')

const ShapeTree = require('./components/ShapeTree')

const SlideBg = require('./components/elements/p-bg')

const BaseSlide = require('./base-slide')

class SlideLayoutXML extends BaseSlide {
    constructor(xml) {
        super(xml)

        this.type = 'layout'
    }
}

module.exports = SlideLayoutXML
