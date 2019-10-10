
const WMF = require("./wmf")
const SVG = require("svg.js")
const {parseTxBody} = require("./text")
const parsePrstShape = require("./prstShape")

const valignMap = {
    "bottom":"flex-end"
}

/**
 * @param {{type:"image",src:"string"}} block
 */
const parseImage = (block)=>{
    let image = document.createElement('img')
    if(block.src){
        image.src = block.src.replace('ppt','')
    }
    return image
}

/**
 * @param {{type:"container"}} block
 */
const parseContainer = (block,pageIndex)=>{
    let wrapper = document.createElement('div')
    let borderWidth = 0
    let stroke = null
    if(block.line && block.line.color){
        borderWidth = block.line.width || 1
        stroke = {
            width:borderWidth,
            color: block.line.color,
            linejoin:"round",
            linecap:"but"
        }
        if(block.line.prstDash == "dot"){
            stroke.dasharray = "3,6"
        }
    }

    if(block.fontSize){
        wrapper.style.fontSize = block.fontSize + "px"
    }
    if(block.color){
        wrapper.style.color = block.color
    }
    let fill =  "transparent"
    if(block.fill){
        if(block.fill.type == "solid"){
            fill = block.fill.value
        }
    }
    parsePrstShape(block,wrapper,stroke,pageIndex)
    if(block.svgs){
        block.svgs.map(svg=>{
            let s = document.createElementNS("http://www.w3.org/2000/svg","svg")
            wrapper.appendChild(s)
            s.style.position = "absolute"
            s.style.left = "0"
            s.style.top = "0"

            let ele = SVG.adopt(s).size("100%","100%")
            if(svg.width && svg.height){
                ele.viewbox(0,0,svg.width,svg.height)
            }


            if(stroke){
                ele.stroke(stroke)
            }

            let str = svg.points.map(g=>{
                if(g.t == "moveTo"){
                    return `M${g.x},${g.y}`
                }else if(g.t == "lnTo"){
                    return `L${g.x},${g.y}`
                }else if(g.t == "cubicBezTo"){
                    let pts = g.pts.map(({x,y})=>{
                        return `${x},${y}`
                    }).join(" ")
                    return `C ${pts}`
                }
                else if(g.t == "close"){
                    return ""
                }
            }).filter(i=>!!i).join(" ")
            let ps = ele.path(str)
            ps.fill(fill)
        })
    }

   
    let textList = (block.text || [])

    if(textList.length){
        let textWrapper = document.createElement("div")
        textWrapper.style.position = "absolute"
        textWrapper.style.left = "0"
        textWrapper.style.top = "0"
        textWrapper.style.width = "100%"
        textWrapper.style.height = "100%"
        textWrapper.setAttribute("data-type","text-wrapper")
        wrapper.appendChild(textWrapper)

        if(block.valign != "top"){
            textWrapper.style.display = "flex"
            textWrapper.style.flexDirection = "column"
            textWrapper.style.justifyContent = valignMap[block.valign] || "center"
        }

        if(block.padding){
            textWrapper.style.boxSizing = "border-box"
            textWrapper.style.padding = `${block.padding.t}px ${block.padding.r}px ${block.padding.b}px ${block.padding.l}px`
        }

        textList.map((p,index)=>{
            let div = parseTxBody(p,index)
            if(p.isSlideNum){
                let slideNum = document.createElement("span")
                slideNum.innerHTML = `${pageIndex + 1}`
                div.appendChild(slideNum)
                console.log(pageIndex)
            }
            textWrapper.appendChild(div)
        })
    }

    return wrapper
}

/**
 * 
 * @param {{position,size,rot}} block 
 * @param {HTMLElement} element 
 */
const buildStyle = (block,element)=>{
    if(!element){
        return
    }
    if(block.rot){
        element.style.transform = `rotate(${block.rot}deg)`
    }
    if(block.position){
        element.style.left = block.position.x + "px"
        element.style.top = block.position.y + "px"
    }
    
    if(block.size){
        element.style.width = (block.size.width )  + "px"
        element.style.height = (block.size.height ) + "px"
    }  
   
    if(block.id){
        element.setAttribute("data-id",block.id)
    }

    element.style.position = "absolute"

}

/**
 * 
 * @param {*} block 
 * @param {HTMLElement} el 
 * @param {*} pageIndex 
 * @param {*} currentSlideEl 
 */
export default (block,el,pageIndex,currentSlideEl) =>{

    /**
     * @type {HTMLElement}
     */
    let element = null

    if(block.type == "container"){
        element = parseContainer(block,pageIndex)
    }else if(block.type == "image"){
        element = parseImage(block)
    }else if(block.type == "rect"){
        let div = document.createElement("div")
        div.style.position = "absolute"
        div.style.left = block.position.x + "px"
        div.style.top = block.position.y + "px"

        div.innerHTML = `<svg  viewBox="0 0 ${block.size.width} ${block.size.height}" width="${block.size.width}" height="${block.size.height}">
            <rect x="0" y="0" fill="${block.fillColor}" width="${block.size.width}" height="${block.size.height}"></rect>
        </svg>`
        el.appendChild(div)

    }else if(block.type == "table"){
        let table = document.createElement("table")
        table.setAttribute("cellspacing",0)
        let cols = block.table.cols

        table.style.position = "absolute"
        if(block.position){
            table.style.left = block.position.x + "px"
            table.style.top = block.position.y + "px"
        }
        // if(block.size){
        //     table.style.width = block.size.width + "px"
        //     table.style.height = block.size.height + "px"
        // }


        block.table.trs.map((tr,j)=>{
            let trEl = document.createElement("tr")
            tr.tcs.map((tc,i)=>{
                let tdEl = document.createElement("td")
                if(cols[i]){
                    tdEl.style.width = cols[i] + "px"
                }
                tc.body.map((p,index)=>{
                    let div = parseTxBody(p,index)
                    tdEl.appendChild(div)
                })
                if(tc.ln){
                    tdEl.style.border = `dashed 1px ${tc.ln.color || "FFF"}`
                    tdEl.style.boxSizing = "border-box"
                    if(j != (block.table.trs.length - 1)){
                        tdEl.style.borderBottom = "none"
                    }
                    if(i != (tr.tcs.length - 1)){
                        tdEl.style.borderRight = "none"
                    }
                }
                trEl.appendChild(tdEl)
            })
            if(tr.height){
                trEl.style.height = tr.height + "px"
            }
            table.appendChild(trEl)
        })

        el.appendChild(table)

    }else if(block.type == "oleObj" && block.src ){
        if(block.src.indexOf(".wmf") > -1){
            let pic = document.createElementNS("http://www.w3.org/2000/svg","svg")
            currentSlideEl.appendChild(pic)
            console.log(block.imgW,block.imgH)
            let svg = SVG.adopt(pic).size(block.width,block.height).viewbox(0,0,block.imgW || 0,block.imgH || 0)
            let wmf = new WMF(svg,block.src.replace('ppt',''))
            pic.style.position = "absolute"
            // pic.style.width = block.width  + "px"
            // pic.style.height = block.height + "px"
            pic.style.left = block.left  + "px"
            pic.style.top = block.top  + "px"
    
            wmf.toPngFile()
        }

    }

    buildStyle(block,element)

    if(element){
        el.appendChild(element)
    }
}