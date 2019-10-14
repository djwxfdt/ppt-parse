const RPr = require('./a-rpr')
const XElement = require('../../xelement')

/**
 * This element specifies a text field which contains generated text that the application should update periodically. Each piece of text when it is generated is given a unique identification number that is used to refer to a specific field. At the time of creation the text field is also specified to be of a certain type which indicates the type of text that should be used to update this field. This update type is used so that all applications that did not create this text field may still know what type of text it should be updated with. Thus the new application can then attach an update type to the text field id for continual updating.
 */
module.exports = class Fld {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        /**
         * @type {string}
         */
        this.text = node.getSingle('a:t')
        if (node.getSingle('a:rPr')) {
            this.rPr = new RPr(node.getSingle('a:rPr'))
        }

        if (node.attributes) {
            /**
             * Specifies the type of update text that should be used within this text field. This is needed in addition to the text field id because a new application that did not create this document must be able to know what update should be assigned to a specific text field id.
             */
            this.type = node.attributes.type

            this.id = node.attributes.id
        }
    }

    isSlideNum() {
        return this.type == 'slidenum'
    }
}
