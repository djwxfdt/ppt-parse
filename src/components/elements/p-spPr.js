const Xfrm = require('./a-xfrm')

module.exports = class SpPr{
    /**
    * @param {XElement} node 
    */
   constructor(node){
       

       let xfrm = node.getSingle("a:xfrm")

       if(xfrm){
           /**
            * This element represents 2-D transforms for ordinary shapes
            */
           this.xfrm = new Xfrm(xfrm)
       }
   }
}