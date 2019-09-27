
const WMF = require("./wmf")
const SVG = require("svg.js")

const {parseTxBody} = require("./text")

/**
 * @type {{size:{width,height},slides:Array<{background:string,blocks:Array<{position:{x,y},size:{width,height},type:string}>}>}}
 */
let slideJson = window.jsonObj


let app = document.getElementById('app')


app.style.width = slideJson.size.width + "px"
app.style.height = slideJson.size.height + "px"

let current = 0
let total = slideJson.slides.length

let currentSlideEl = null

// if(slideJson.fonts){
//     slideJson.fonts.map(f=>{
//         let font = new FontFace(f.name,`url(${f.url})`)
//         font.load().then(loaded_face=>{
//             document.fonts.add(loaded_face)
//             debugger
//         })
//     })
// }

const valignMap = {
    "bottom":"flex-end"
}



const parseBlock = (block,el,pageIndex) =>{
    if(block.type == "container"){
        let wrapper = document.createElement('div')

        if(block.id){
            wrapper.setAttribute("data-id",block.id)
        }
        el.appendChild(wrapper)

        wrapper.style.position = "absolute"

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


        if(block.position){
            wrapper.style.left = block.position.x + "px"
            wrapper.style.top = block.position.y + "px"
        }
        if(block.size){

            wrapper.style.width = (block.size.width )  + "px"
            wrapper.style.height = (block.size.height ) + "px"
        }      

        if(block.fontSize){
            wrapper.style.fontSize = block.fontSize + "px"
        }

        if(block.color){
            wrapper.style.color = block.color
        }

        if(block.rot){
            wrapper.style.transform = `rotate(${block.rot}deg)`
        }

        let fill =  "transparent"
        if(block.fill){
            if(block.fill.type == "solid"){
                fill = block.fill.value
            }
        }
        

       
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
                        return `M ${g.x} ${g.y}`
                    }else if(g.t == "lnTo"){
                        return `L ${g.x} ${g.y}`
                    }else if(g.t == "close"){
                        return "z"
                    }
                }).join(" ")
                let ps = ele.path(str)
                ps.fill(fill)
            })
        }

        if(block.prstShape  && block.fill ){
            let s = document.createElementNS("http://www.w3.org/2000/svg","svg")
            wrapper.appendChild(s)
            s.style.position = "absolute"
            s.style.left = "0"
            s.style.top = "0"

            let ele = SVG.adopt(s).size("100%","100%").viewbox(0,0,block.size.width,block.size.height)
            let {width,height} = block.size

            if(block.fill.type == "grad"){
                fill = ele.gradient("linear",stop=>{
                    block.fill.value.map(v=>{
                        stop.at(v.pos / 100,v.value)
                    })
                })
            }

            if(block.prstShape.type == "rect" ){
                let rt = ele.rect(width,height)
                rt.fill(fill)
                if(stroke){
                    rt.stroke(stroke)
                }
               
            }else if(block.prstShape.type == "diamond"){
                ele.path(`M ${width/2} 0 L ${width} ${height/2} L ${width/2} ${height} L 0 ${height/2} L ${width/2} 0 z`).fill(fill)
            }
            else if(block.prstShape.type == "roundRect"){
                let rt = ele.rect( block.size.width,block.size.height)
                rt.fill(fill)
                rt.radius(Math.min(block.size.width / 2,block.size.height / 2))
            }else if(block.prstShape.type == "ellipse"){
                ele.ellipse( block.size.width,block.size.height).fill(fill)
            }else if(block.prstShape.type == "donut"){
                let grad = ele.gradient("radial",stop=>{
                    stop.at(0,"transparent")
                    stop.at(0.1,"white")
                    stop.at(0.3,"white")
                    stop.at(0.3,fill)
                    stop.at(0.8,fill)
                    stop.at(0.8,"white")
                    stop.at(1,"white")
                })
                ele.circle(block.size.width).center(block.size.width / 2,block.size.height / 2).fill(grad)
            }else if("round2SameRect" == block.prstShape.type ){
                ele.rect( block.size.width,block.size.height).fill(fill)
                s.style.borderTopLeftRadius = "10px"
                s.style.borderTopRightRadius = "10px"
            }else if("pie" == block.prstShape.type){
                s.style.borderRadius = "50%"
                let pie = ele.circle(block.size.width).fill(fill)
                let c = Math.PI * block.size.width
                pie.attr({"stroke-dasharray":`${c/4} ${c}`,"stroke":"white","stroke-width":block.size.width,"stroke-dashoffset":c/4*3})
            }else if("line" == block.prstShape.type){
                console.log(block.size)
                ele.line(0,0,block.size.width-2,block.size.height-2).stroke({"color":fill,"width":2,linecap:"round"})
            }
            else{
                console.warn("unsported", block.prstShape,pageIndex)
            }
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


    }else if(block.type == "image" && block.src){
        let image = document.createElement('img')
        image.style.position = "absolute"
        image.style.left = block.position.x + "px"
        image.style.top = block.position.y + "px"
        image.style.width = block.size.width + "px"
        image.style.height = block.size.height + "px"
        image.src = block.src.replace('ppt','')
        el.appendChild(image)

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
}

/**
 * 
 * @param {Array<{type:string,position,size,chOff,children:Array}>} blocks 
 * @param {*} el 
 * @param {*} pageIndex 
 */
const parseBlocks = (blocks,el,pageIndex)=>{
    for(let j=0;j<blocks.length;j++){
        let block = blocks[j]
        if(block.type == "group"){
            let group = document.createElement("div")
            group.style.position = "absolute"
            group.style.left = block.position.x + "px"
            group.style.top = block.position.y + "px"
            group.style.width = block.size.width + "px"
            group.style.height = block.size.height + "px"


            let wrapper  = document.createElement("div")
            wrapper.setAttribute("data-type","group")
            wrapper.style.position = "relative"
            group.appendChild(wrapper)


            el.appendChild(group)

            // let sX = 1
            // let sY = 1

            // let childTransform = []
            
            // if(block.chExt && block.chExt.width && block.chExt.height){
                
            //     let ssX = block.size.width / block.chExt.width
            //     let ssY = block.size.height / block.chExt.height
            //     console.log(ssX)
            //     sX = scaleX * ssX
            //     sY = scaleY * ssY
            //     /**
            //      * 先scale再translate
            //      */
            //     // childTransform.push(`scale(${ssX},${ssY})`) 
            // }

            // if(block.chOff){
            //     // childTransform.push(`translate(-${block.chOff.x}px, -${block.chOff.y}px)`)
            // }

            parseBlocks(block.children,wrapper,pageIndex)


            // if(childTransform.length){
            //     wrapper.style.transform =  childTransform.join(" ")
            //     wrapper.style.transformOrigin = "left top"
            // }



        }else{
            parseBlock(block,el,pageIndex)
        }
    }

}

for(let i = 0;i<slideJson.slides.length;i++){
    
    let el = document.createElement('div')
    app.appendChild(el)
    currentSlideEl = el

    el.style.position = "absolute"
    el.style.width = "100%"
    el.style.height = "100%"
    if(i==0){
        el.style.display = "block"
    }else{
        el.style.display = "none"
    }
    


    let slide = slideJson.slides[i]

    switch(slide.transition && slide.transition.type){
        case "fade":{
            el.setAttribute("class","slide-fade-thruBlk")
            break
        }
        case "circle":{
            el.setAttribute("class","slide-circle")
            break
        }
        case "cover":{
            el.setAttribute("class",`slide-cover-${slide.transition.dir}`)

            break
        }
        default:{
            el.setAttribute("class","slide")
        }
    }

    el.style.backgroundColor = "white"

    let wrapper = document.createElement("div")
    wrapper.style.position = "absolute"
    wrapper.style.left = wrapper.style.top = "0"
    wrapper.style.width = wrapper.style.height = "100%"

    el.appendChild(wrapper)



    if(slide.backgroundImage){
        wrapper.style.backgroundImage = `url(${slide.backgroundImage.replace('ppt','')})`
        wrapper.style.backgroundSize = "cover"
    }


    if(slide.backgroundColor){
        if(slide.backgroundColor.type == "grad"){
            let str = `linear-gradient(to right,${slide.backgroundColor.value.map(c=>{
                return `${c.value} ${c.pos}%`
            }).join(",")})`
            wrapper.style.background = str
        }else{
            wrapper.style.backgroundColor = slide.backgroundColor.value
        }
    }
    try {
        parseBlocks(slide.blocks,wrapper,i)

    } catch (error) {
        console.error(error)
    }

   
}


const goNext = ()=>{
    current ++
    app.childNodes.forEach((el,index)=>{
        el.style.display = "none"
        if(current == index){
            el.style.display = "block"
        }
    })
}
const goPrev = ()=>{
    current --
    app.childNodes.forEach((el,index)=>{
        el.style.display = "none"
        if(current == index){
            el.style.display = "block"
        }
    })
}


window.addEventListener("keyup",e=>{
    if(e.keyCode == 39){
        e.preventDefault()
        goNext()
    }else if(e.keyCode == 37){
        e.preventDefault()
        goPrev()
    }
})

document.getElementById("app").addEventListener("click",e=>{
    goNext()
})