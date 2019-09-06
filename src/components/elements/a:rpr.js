const XElement = require('../../xelement')

module.exports =  class RPr{
    /**
    * @param {XElement} node 
    */
   constructor(node){
       

       this.size = node.attributes.sz

       if(!isNaN(this.size)){
           /**
            * Specifies the size of text within a text run. Whole points are specified in increments of 100 starting with 100 being a point size of 1. For instance a font point size of 12 would be 1200 and a font point size of 12.5 would be 1250. If this attribute is omitted, than the value in <defRPr> should be used.
            */
           this.size = +this.size / 100
       }

       /**
        * Specifies whether a run of text will be formatted as bold text. If this attribute is omitted, than a value of 0, or false is assumed.
        */
       this.bold = node.attributes.b == "1"

       /**
        * Specifies whether a run of text will be formatted as italic text. If this attribute is omitted, than a value of 0, or false is assumed.
        */
       this.italic = node.attributes.i == "1"

       /**
        * Specifies whether a run of text will be formatted as strikethrough text. If this attribute is omitted, than no strikethrough is assumed.
        */
       this.strike = node.attributes.strike

       if(node.getSingle("a:solidFill")){
           this.solidFill = node.selectFirst(["a:solidFill","a:srgbClr"]).attributes.val || node.selectFirst(["a:solidFill","a:schemeClr"]).attributes.val
       }

       /**
        * Specifies the baseline for both the superscript and subscript fonts. The size is specified using a percentage where 1000 is equal to 1 percent of the font size and 100000 is equal to 100 percent font of the font size
        */
       this.baseline = node.attributes.baseline

       if(node.getSingle("a:latin")){
           this.typeface = node.getSingle("a:latin").attributes.typeface
       }
       
   }
}