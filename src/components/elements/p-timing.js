const XElement = require('../../xelement')

class CBhvr {}

/**
 * This element allows the setting of a particular property value to a fixed value while the behavior is active and restores the value when the behavior is reset or turned off.
 */
class TSet {}

class ChildTnLst {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.children = node.children
            .map(c => {
                if (c.name == 'p:seq') {
                    return new Seq(c)
                } else if (c.name == 'p:par') {
                    return new Par(c)
                }
            })
            .filter(c => !!c)
    }
}

/**
 * This element describes the properties that are common for time nodes.
 */
class Ctn {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        /**
         * This attribute describes the duration of the time node, expressed as unit time.
         */
        this.dur = node.attributes.dur

        /**
         * This attribute specifies the type of time node.
         */
        this.nodeType = node.attributes.nodeType

        const childTnLst = node.getSingle('p:childTnLst')
        if (childTnLst) {
            this.childTnLst = new ChildTnLst(childTnLst)
        }
    }
}

/**
 * This element describes the Parallel time node which can be activated along with other parallel time node containers. Conceptually it can be thought of as follows:
 */
class Par {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        const ctn = node.getSingle('p:cTn')
        if (ctn) {
            this.ctn = new Ctn(ctn)
        }
    }
}

/**
 * This element describes the Sequence time node and it can only be activated when the one before it finishes. Conceptually it can be though of as follows:
 */
class Seq {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        const ctn = node.getSingle('p:cTn')
        if (ctn) {
            this.ctn = new Ctn(ctn)
        }
    }
}

/**
 * This element specifies a list of time node elements used in an animation sequence.
 */
class TnLst {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        this.children = node.children
            .map(c => {
                if (c.name == 'p:seq') {
                    return new Seq(c)
                } else if (c.name == 'p:par') {
                    return new Par(c)
                }
            })
            .filter(c => !!c)
    }
}

/**
 * This element specifies the timing information for handling all animations and timed events within the corresponding slide. This information is tracked via time nodes within the <timing> element. More information on the specifics of these time nodes and how they are to be defined can be found within the Animation section of the <PresentationML> framework.
 */
module.exports = class Timing {
    /**
     * @param {XElement} node
     */
    constructor(node) {
        const tnLst = node.getSingle('p:tnLst')
        if (tnLst) {
            this.tnLst = new TnLst(tnLst)
        }
    }
}
