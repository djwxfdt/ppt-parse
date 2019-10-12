const SVG = require("svg.js")
const {hexToRgba} = require("./utils")

const toXY = (arc,r,c)=>{
    return [
        Math.round(c + r / 2 * Math.cos(arc/180 * Math.PI)),
        Math.round(c - r / 2 * Math.sin(arc/180 * Math.PI))
    ]
}

/**
 * 
 * @param {{prstShape:{type:"string"},fill:{type:"grad"|"solid",value},size:{width,height}}} block 
 * @param {HTMLElement} wrapper
 */
const parse = (block, wrapper, stroke,pageIndex) => {

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
            fill = hexToRgba(block.fill.value)
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
                let a1 = avList[0]
                let a2 = avList[avList.length - 1]

                let [x1,y1] = toXY(a1,width,width/2)
                let [x2,y2] = toXY(a2,width,width/2)
                let [x11,y11] = toXY(a1,width / 3,width/2)
                let [x22,y22] = toXY(a2,width / 3,width/2)

                let str1 = `M${x1} ${y1} A${width/2} ${height/2} ${0} 0 1 ${x2} ${y2} L${x22} ${y22}`
                let str2 = `A${width/6} ${height/6} ${0} 0 0 ${x11} ${y11} L${x1} ${y1}`
                let str = str1 + " " + str2 + " "+ " Z"

                s.setAttribute("data-json",JSON.stringify(block.prstShape))
          
                ele.path(str).fill(fill)
            }
        }else if("arc" == block.prstShape.type){
            let avList = block.prstShape.avLst
            if(avList.length>1){
                let a1 = avList[0]
                let a2 = avList[avList.length - 1]
                let [x1,y1] = toXY(a1,width,width/2)
                let [x2,y2] = toXY(a2,width,width/2)
                let str = `M${x1} ${y1} A${width/2} ${height/2} ${0} 0 1 ${x2} ${y2}`
                s.setAttribute("data-json",JSON.stringify(block.prstShape))
                ele.path(str).fill("transparent").stroke({color:fill,width:2})
            }

        }
        else if("chevron" == block.prstShape.type){
            let strA = []
            strA.push(`M 0,0`)
            strA.push(`L ${width/2} 0`)
            strA.push(`L ${width} ${height/2}`)
            strA.push(`L ${width/2} ${height}`)
            strA.push(`L 0 ${height}`)
            strA.push(`L ${width/2} ${height/2}`)
            strA.push(`z`)
            ele.path(strA.join(" ")).fill(fill)
        }else if("triangle" == block.prstShape.type){
            let strA = []
            strA.push(`M ${width/2} 0`)
            strA.push(`L ${width} ${height}`)
            strA.push(`L 0 ${height}`)
            strA.push(`z`)
            ele.path(strA.join(" ")).fill(fill)
        }
        else {
            console.warn("unsported", block.prstShape,pageIndex)
        }
    }

}

module.exports = parse