
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
                cx:this.toPix(ext.attributes.cx),
                cy:this.toPix(ext.attributes.cy)
            }
        }

        let off = node.getSingle("a:off")
        if(off){
            /**
             * This element specifies the location of the bounding box of an object. Effects on an object are not included in this bounding box.
             */
            this.off = {
                x:this.toPix(off.attributes.x),
                y:this.toPix(off.attributes.y)
            }
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

        let chExt = node.getSingle("a:chExt")
        if(chExt){
            /**
             * Specifies the length of the extents rectangle in EMUs. This rectangle shall dictate the size of the object as displayed (the result of any scaling to the original object).
             */
            this.chExt = {
                width:this.toPix(chExt.attributes.cx) || 1,
                height:this.toPix(chExt.attributes.cy) || 1
            }
        }

    }

    toPix(pt){
        return Math.floor(+pt * 96 / 91440) / 10
    }
}
