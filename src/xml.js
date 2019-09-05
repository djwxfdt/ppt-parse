const {searchXML,parseString} = require('./utils')

const SlideXML = require('./slide')

const SlideLayoutXML = require('./slide-layout')

const SlideMasterXML = require('./slide-mater')

const SlideRelXML = require('./slide-rel')

const SlideLayoutRelXml = require('./slide-layout-rel')

const ThemeXML = require('./theme')


class RelsXML {
    constructor(xml) {
        /**
         * @type {Array<{attrs:{Type:string,Target}}>}
         */
        this.xml = xml.Relationships.Relationship

    }

    get themePath() {
        let find = this.xml.find(item => item.attrs.Type.indexOf('relationships/theme') > -1)
        if (find) {
            return find.attrs.Target
        }
        return null
    }
}



class PresentationXML {
    constructor(xml) {
        /**
         * @type {{["p:sldSz"]}}
         */
        this.xml = xml["p:presentation"]

    }

    get slideSize() {
        let w = +this.xml["p:sldSz"][0].attrs.cx
        let h = +this.xml["p:sldSz"][0].attrs.cy

        return { width: w * 96 / 914400, height: h * 96 / 914400 }
    }
}



/**
 * @returns {Promise<RelsXML>}
 */
const parseRelsXML = str => parseString(RelsXML)(str)

/**
 * @returns {Promise<ThemeXML>}
 */
const parseThemeXML = str => parseString(ThemeXML)(str)

/**
 * @returns {Promise<PresentationXML>}
 */
const parseRresentaionXML = str => parseString(PresentationXML)(str)


/**
 * @returns {Promise<SlideRelXML>}
 */
const parseSlideRelXML = str => parseString(SlideRelXML)(str)


/**
 * @returns {Promise<SlideXML>} 
 */
const parseSlideXML = str => parseString(SlideXML)(str)

/**
 * @returns {Promise<SlideMasterXML>} 
 */
const parseSlideMaterXML = str => parseString(SlideMasterXML)(str)

/**
 * @returns {Promise<SlideLayoutRelXml>} 
 */
const parseSlideLayoutRelXML = str => parseString(SlideLayoutRelXml)(str)

/**
 * @returns {Promise<SlideLayoutXML>} 
 */
const parseSlideLayoutXML = str => parseString(SlideLayoutXML)(str)

module.exports = {
    parseRelsXML,
    parseThemeXML,
    parseRresentaionXML,
    parseSlideXML,
    parseSlideRelXML,
    parseSlideLayoutXML,
    parseSlideMaterXML,
    parseSlideLayoutRelXML
}
