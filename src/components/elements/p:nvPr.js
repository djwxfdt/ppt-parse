module.exports = class NvPr{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        

        let ph = node.getSingle('p:ph')

        if(ph){
            this.placeholder = {
                idx:ph.attributes.idx,
                type:ph.attributes.type,
                sz:ph.attributes.sz,
                orient:ph.attributes.orient
            }
        }
        
    }
}