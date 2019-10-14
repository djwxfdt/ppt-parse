module.exports = class NvPr {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        let ph = node.getSingle('p:ph')

        if (ph) {
            /**
             * @type {"body"|"ctrTitle"|"title"|"pic"|"title"|"subTitle"|"tbl"|"dt"|"chart"}
             */
            let type = ph.attributes.type
            this.placeholder = {
                idx: ph.attributes.idx,
                type,
                sz: ph.attributes.sz,
                orient: ph.attributes.orient
            }
        }
    }
}
