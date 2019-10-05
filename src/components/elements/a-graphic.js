const XElement = require('../../xelement')

const TxBody = require('./p-txBody')

const Ln = require('./a-ln')

const Pic = require('./p-pic')

const { EMU2PIX } = require('../measure')

class TcPr {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.marT = EMU2PIX(node.attributes.marT)

        this.marB = EMU2PIX(node.attributes.marB)

        this.marR = EMU2PIX(node.attributes.marR)

        this.marL = EMU2PIX(node.attributes.marL)

        this.anchor = node.attributes.anchor

        const lnL = node.getSingle('a:lnL')
        if (lnL) {
            this.lnL = new Ln(lnL)
        }

        const lnR = node.getSingle('a:lnR')
        if (lnR) {
            this.lnR = new Ln(lnR)
        }

        const lnT = node.getSingle('a:lnT')
        if (lnT) {
            this.lnT = new Ln(lnT)
        }

        const lnB = node.getSingle('a:lnB')
        if (lnB) {
            this.lnB = new Ln(lnB)
        }
    }

    get margin() {
        return {
            t: this.marT,
            b: this.marB,
            r: this.marR,
            l: this.marL
        }
    }

    get ln() {
        const ln = this.lnL || this.lnR || this.lnB || this.lnT
        if (ln) {
            return ln.toJSON()
        }
    }
}

class Tc {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        const txBody = node.getSingle('a:txBody')
        if (txBody) {
            this.txBody = new TxBody(txBody)
        }

        const tcPr = node.getSingle('a:tcPr')
        if (tcPr) {
            this.tcPr = new TcPr(tcPr)
        }
    }
}

class Tr {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        const h = node.attributes.h
        if (h) {
            this.height = EMU2PIX(h)
        }

        this.tcs = node.selectArray(['a:tc']).map(c => new Tc(c))
    }
}

class Table {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.trs = node.selectArray(['a:tr']).map(c => new Tr(c))

        const tblGrid = node.getSingle('a:tblGrid')

        if (tblGrid) {
            this.gridCols = tblGrid.selectArray(['a:gridCol']).map(c => {
                return EMU2PIX(c.attributes.w)
            })
        }
    }
}

class OleObj {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.rid = node.attributes['r:id']
        this.imgW = EMU2PIX(node.attributes.imgW)
        this.imgH = EMU2PIX(node.attributes.imgH)

        const pic = node.getSingle('p:pic')
        if (pic) {
            this.pic = new Pic(pic)
        }

        this.spid = node.attributes.spid
    }
}

class GraphicData {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        /**
         * Specifies the URI, or uniform resource identifier that represents the data stored under this tag. The URI is used to identify the correct 'server' that can process the contents of this tag.
         */
        this.uri = node.attributes.uri

        const table = node.getSingle('a:tbl')
        if (table) {
            this.table = new Table(table)
            this.type = 'table'
        }

        const oleObj =
            node.selectFirst(['p:oleObj']) ||
            node.selectFirst(['mc:AlternateContent', 'mc:Choice', 'p:oleObj'])

        if (oleObj) {
            this.type = 'oleObj'
            this.oleObj = new OleObj(oleObj)
        }
    }
}

module.exports = class Graphic {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        const gData = node.getSingle('a:graphicData')
        if (gData) {
            this.graphicData = new GraphicData(gData)
        }
    }

    get type() {
        if (this.graphicData) {
            return this.graphicData.type
        }
    }

    get table() {
        if (this.graphicData) {
            return this.graphicData.table
        }
    }

    get oleObj() {
        if (this.graphicData) {
            return this.graphicData.oleObj
        }
    }
}
