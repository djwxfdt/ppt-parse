const {searchXML,parseString} = require('./utils')

const SlideXML = require('./slide')

const SlideLayoutXML = require('./slide-layout')

const SlideMasterXML = require('./slide-master')

const {SlideRelXML,SlideLayoutRelXml,PresentationRelXML,MasterRelXml} = require('./xml-rels')

const ThemeXML = require('./theme')

const PresentationXML = require('./presentation')

const VMLDrawing = require("./vml-drawing")


/**
 * @returns {Promise<PresentationRelXML>}
 */
const parseRelsXML = str => parseString(PresentationRelXML)(str)

/**
 * @returns {Promise<MasterRelXml>}
 */
const parseMaterXml = str => parseString(MasterRelXml)(str) 

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


/**
 * @returns {Promise<VMLDrawing>} 
 */
const parseVmlXML = str => parseString(VMLDrawing)(str)

module.exports = {
    parseRelsXML,
    parseThemeXML,
    parseRresentaionXML,
    parseSlideXML,
    parseSlideRelXML,
    parseSlideLayoutXML,
    parseSlideMaterXML,
    parseSlideLayoutRelXML,
    parseVmlXML
}
