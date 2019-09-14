
module.exports =  class Xfrm{
    /**
     * @param {XElement} node 
     */
    constructor(node){
        

        
        let ext = node.getSingle("a:ext")
        if(ext){
            /**
             * This element specifies the size of the bounding box enclosing the referenced object.
             */
            this.ext = {
                cx:+ext.attributes.cx,
                cy:+ext.attributes.cy
            }

            this.ext.cx = Math.floor(this.ext.cx * 96 / 91440) / 10
            this.ext.cy = Math.floor(this.ext.cy * 96 / 91440) / 10

        }

        let off = node.getSingle("a:off")
        if(off){
            /**
             * This element specifies the location of the bounding box of an object. Effects on an object are not included in this bounding box.
             */
            this.off = {
                x:+off.attributes.x,
                y:+off.attributes.y
            }
            this.off.x = Math.floor(this.off.x * 96 / 91440) / 10
            this.off.y = Math.floor(this.off.y * 96 / 91440) / 10
        }

        let rot = node.attributes.rot
        if(rot){
            /**
             * Roation is specified with the rot attribute. Values are in 60,000ths of a degree, with positive angles moving clockwise or towards the positive y-axis
             */
            this.rot = Math.floor(+rot / 60000)
        }

        let chOff = node.getSingle("a:chOff")
        if(chOff){
            /**
             * This element specifies the location of the child extents rectangle and is used for calculations of grouping, scaling, and rotation behavior of shapes placed within a group.
             */
            this.chOff = {
                x:this.toPix(chOff.attributes.x),
                y:this.toPix(chOff.attributes.y)
            }
        }

    }

    toPix(pt){
        return Math.floor(+pt * 96 / 91440) / 10
    }
}
