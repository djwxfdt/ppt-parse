const XElement = require('./xelement')

module.exports = class VMLDrawing {
    constructor(xml) {
        this.xml = XElement.init(xml).selectFirst(['v:shape'])

        this.spid = this.xml.attributes['o:spid']

        const imagedata = this.xml.getSingle('v:imagedata')

        /**
         * 应该使用rel引用，偷个懒
         */
        if (imagedata) {
            this.src = imagedata.attributes['o:title']
        }

        const NumKeys = { left: 1, top: 1, width: 1, height: 1 }

        const style = this.xml.attributes.style || ''

        this.styleObj = style
            .split(';')
            .filter(i => i)
            .map(str => {
                const arry = str.split(':')
                const key = arry[0]
                let value = arry[1]
                if (NumKeys[key]) {
                    value = (Number(value.replace('pt', '')) / 3) * 4
                }
                return { key, value }
            })
            .reduce((p, c) => {
                p[c.key] = c.value
                return p
            }, {})

        this.width = this.styleObj.width
        this.left = this.styleObj.left
        this.height = this.styleObj.height
        this.top = this.styleObj.top
    }
}
