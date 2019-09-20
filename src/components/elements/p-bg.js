const XElement = require('../../xelement')

const BlipFill = require("./p-blipFill")

const SolidFill = require("./a-solidFill")

const GradFill = require("./a-gradFill")

/**
 * This element specifies visual effects used to render the slide background. This includes any fill, image, or effects that are to make up the background of the slide.
 */
class BgPr{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        let blipFill = node.getSingle("a:blipFill")
        if(blipFill){
            this.blipFill = new BlipFill(blipFill)
        }

        let solidFill = node.getSingle("a:solidFill")

        if (solidFill) {
            this.solidFill = new SolidFill(solidFill)
        }

        let gradFill = node.getSingle("a:gradFill")

        if(gradFill){
            this.gradFill = new GradFill(gradFill)
        }

    }
}

 
module.exports = class Bg{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        let bgPr = node.getSingle("p:bgPr")
        if(bgPr){
            this.bgPr = new BgPr(bgPr)
        }
    }

    get imageEmbed(){
        if(this.bgPr && this.bgPr.blipFill ){
            return this.bgPr.blipFill.embed
        }
    }

    get imageSrc(){
        return this._src
    }

    set imageSrc(v){
        this._src = v
    }

    /**
     * @returns {{type:"srgbClr"|"schemeClr"|"grad",value:"FFFFFF"|Array<{color:{type:"srgbClr"|"schemeClr",value},pos}>}}
     */
    get color(){
        if(!this.bgPr){
            return
        }
        
        if(this.bgPr.solidFill){
            return this.bgPr.solidFill
        }
        if(this.bgPr.gradFill){
            return {
                type:"grad",
                value:this.bgPr.gradFill.color
            }
        }
    }
}