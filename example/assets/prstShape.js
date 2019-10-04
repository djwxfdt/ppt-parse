const SVG = require("svg.js")


/**
 * 
 * @param {{prstShape:{type:"string"},fill:{type:"grad"|"solid",value},size:{width,height}}} block 
 * @param {HTMLElement} wrapper
 */
const parse = (block, wrapper, stroke) => {

    let fill = "transparent"

    if (!block.size) {
        return
    }

    let { width, height } = block.size



    if (block.prstShape && block.fill) {

        if (block.prstShape.type == "line") {

            wrapper.style.width = (width || 4) + "px"
            wrapper.style.height = (height || 4) + "px"

            block.size = null;
        }


        if (block.fill.type == "solid") {
            fill = block.fill.value
        }

        let s = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        wrapper.appendChild(s)
        s.style.position = "absolute"
        s.style.left = "0"
        s.style.top = "0"

        let ele = SVG.adopt(s)
        ele.size("100%", "100%").viewbox(0, 0, width || 4, height || 4)

        if (block.fill.type == "grad") {
            fill = ele.gradient("linear", stop => {
                block.fill.value.map(v => {
                    stop.at(v.pos / 100, v.value)
                })
            })
        }

        if (block.prstShape.type == "rect") {
            let rt = ele.rect(width, height)
            rt.fill(fill)
            if (stroke) {
                rt.stroke(stroke)
            }

        } else if (block.prstShape.type == "diamond") {
            ele.path(`M ${width / 2} 0 L ${width} ${height / 2} L ${width / 2} ${height} L 0 ${height / 2} L ${width / 2} 0 z`).fill(fill)
        }
        else if (block.prstShape.type == "roundRect") {
            let rt = ele.rect(width, height)
            rt.fill(fill)
            rt.radius(Math.min(width / 2, height / 2))
        } else if (block.prstShape.type == "ellipse") {
            ele.ellipse(width, height).fill(fill)
        } else if (block.prstShape.type == "donut") {
            let grad = ele.gradient("radial", stop => {
                stop.at(0, "transparent")
                stop.at(0.1, "white")
                stop.at(0.3, "white")
                stop.at(0.3, fill)
                stop.at(0.8, fill)
                stop.at(0.8, "white")
                stop.at(1, "white")
            })
            ele.circle(width).center(width / 2, height / 2).fill(grad)
        } else if ("round2SameRect" == block.prstShape.type) {
            ele.rect(width, height).fill(fill)
            s.style.borderTopLeftRadius = "10px"
            s.style.borderTopRightRadius = "10px"
        } else if ("pie" == block.prstShape.type) {
            s.style.borderRadius = "50%"
            let pie = ele.circle(width).fill(fill)
            let c = Math.PI * width
            pie.attr({ "stroke-dasharray": `${c / 4} ${c}`, "stroke": "white", "stroke-width": width, "stroke-dashoffset": c / 4 * 3 })
        } else if ("line" == block.prstShape.type) {
            ele.line(0, 0, width, height).stroke({ "color": fill, "width": 2, linecap: "round" })
        }else if("blockArc" == block.prstShape.type){
            let avList = block.prstShape.avLst
            if(avList.length>1){
                // let a1 = avList[0]
                // let a2 = avList[avList.length - 1]

                // let x1 = Math.round(width / 2 + width / 2 * Math.cos(a1))
                // let y1 = Math.round(height / 2 - width / 2 * Math.sin(a1))

                // let x2 = Math.round(width / 2 + width / 2 * Math.cos(a2))
                // let y2 = Math.round(height / 2 - width / 2 * Math.sin(a2))

                // let str = `M${x1} ${y1} A${width/2},${height/2} ${a2 - a1} 1,0 ${x2},${y2}`
          
                // ele.path(str).fill("transparent").stroke({ "color": fill, "width": 2, linecap: "round" })
            }
            let arry = []
            // avList.map((av,index)=>{
            
            // let arc = ele.arc()
            // debugger
        }
        else {
            console.warn("unsported", block.prstShape)
        }
    }

}

module.exports = parse