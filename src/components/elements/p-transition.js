const XElement = require('../../xelement')

module.exports = class Transition {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        const fade = node.getSingle('p:fade')
        if (fade) {
            this.type = 'fade'
            /**
             * This attribute specifies if the transition will start from a black screen (and then transition the new slide over black).
             */
            this.thruBlk = !!fade.attributes.thruBlk
        }

        const circle = node.getSingle('p:circle')
        if (circle) {
            this.type = 'circle'
        }

        const cover = node.getSingle('p:cover')
        if (cover) {
            this.type = 'cover'
            /**
             * This attribute specifies if the direction of the transition
             * 比如:ld->向左下方向进入
             */
            this.dir = cover.attributes.dir || 'ld'
        }
    }

    toJSON() {
        return {
            type: this.type,
            thruBlk: this.thruBlk,
            dir: this.dir
        }
    }
}
