const R = require('./a:r')

module.exports =  class P{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        

        this.rList = node.selectArray(["a:r"]).map(r=>new R(r))
    }
}