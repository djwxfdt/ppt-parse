

/**
 * @type {{size:{width,height},slides:Array<{background:string,blocks:Array<{position:{x,y},size:{width,height},type:string}>}>}}
 */
let slideJson = window.jsonObj


let app = document.getElementById('app')


app.style.width = slideJson.size.width + "px"
app.style.height = slideJson.size.height + "px"

let current = 0
let total = slideJson.slides.length


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

const parseTxBody = (p,index) =>{
    let pWrapper = document.createElement('div')
    pWrapper.style.zIndex = "1"
    pWrapper.style.position = "relative"

    // div.style.whiteSpace = "pre"
    if( p.algn == "ctr"){
        pWrapper.style.textAlign = "center"
    }
    if(p.color){
        pWrapper.style.color = "#" + p.color
    }
    if(p.lnPct){
        pWrapper.style.lineHeight = p.lnPct / 100
    }

    if(p.spcBef && index != 0){
        pWrapper.style.marginTop = p.spcBef + "px"
    }

    let textsEl = document.createElement("div")

    if(p.algn == "r"){
        pWrapper.style.textAlign = "right"
    }

    let marL = (p.marL || 0) + (p.indent || 0)

    if(marL){
        textsEl.style.marginLeft = (marL) + "px"
    }

    if(p.bullet){
        let bullet = document.createElement("span")
        bullet.innerHTML = p.bullet.char
        bullet.style.fontSize = p.bullet.sz + "px"
        if(p.bullet.color){
            bullet.style.color = "#" + p.bullet.color
        }
        pWrapper.style.display = "flex"

        let bulletWrapper = document.createElement("div")
        // bulletWrapper.style.position = "absolute"
        // bulletWrapper.style.left = bullet.style.top = "0"

        bulletWrapper.appendChild(bullet)
        pWrapper.appendChild(bulletWrapper)
    }

    

    
    
    pWrapper.appendChild(textsEl)

    p.children.map((t)=>{
        if(!t.value){
            return
        }

        if(t.link){

        }

        let span = document.createElement('span')

        if(t.link){
            span = document.createElement("a")
            span.setAttribute("href","#")
        }
        if(t.color){
            span.style.color = "#" + t.color
        }
        let str = t.value.replace(/( )( )/g,"&nbsp&nbsp")
        
        span.innerHTML = str
        if(t.size){
            span.style.fontSize  = t.size + "px"
        }
        
        if(t.fontFamily){
            span.style.fontFamily = t.fontFamily.join(",")
        }
        if(t.valign){
            span.style.verticalAlign = t.valign + "%"
        }
        
       
        if(t.bold){
            span.style.fontWeight = "bold"
        }
        if(t.italic){
            span.style.fontStyle = "italic"
        }

        if(t.underline){
            span.style.textDecoration = "underline"
        }

        if(t.highlight){
            span.style.backgroundColor = "#" + t.highlight
        }

        if(t.baseline){
            span.style.verticalAlign = t.baseline + "%"
        }


        textsEl.appendChild(span)
    })

   

    return pWrapper
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
                color:"#" + block.line.color,
                linejoin:"round",
                linecap:"but"
            }
            if(block.line.prstDash == "dot"){
                stroke.dasharray = "3,6"
            }
        }

        if(block.prstShape && block.prstShape.type == "line"){
            block.size.width = block.size.width  
            block.size.height = block.size.height  
        }


        if(block.position){
            wrapper.style.left = block.position.x + "px"
            wrapper.style.top = block.position.y + "px"
        }
        if(block.size){
            wrapper.style.width = block.size.width + "px"
            wrapper.style.height = block.size.height + "px"
        }      

        if(block.fontSize){
            wrapper.style.fontSize = block.fontSize + "px"
        }

        if(block.color){
            wrapper.style.color = "#" + block.color
        }

        if(block.rot){
            wrapper.style.transform = `rotate(${block.rot}deg)`
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
                    // let scale = Math.min(block.size.width / svg.width,block.size.height / svg.height)
                    // stroke.width = stroke.width / scale
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
                if(block.fill){
                    ps.fill("#" + block.fill.value)
                }else{
                    ps.fill("transparent")
                }
            })
        }

        if(block.prstShape  && block.fill ){
            let fill =  "transparent"
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
                        stop.at(v.pos / 100,"#" + v.color)
                    })
                })
            }else{
                fill = "#" + block.fill.value
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
            <rect x="0" y="0" fill="#${block.fillColor}" width="${block.size.width}" height="${block.size.height}"></rect>
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
                    tdEl.style.border = `dashed 1px #${tc.ln.color || "FFF"}`
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

            parseBlocks(block.children,wrapper,pageIndex)

            let childTransform = []

            
            if(block.chExt && block.chExt.width && block.chExt.height){
                let scaleX = block.size.width / block.chExt.width
                let scaleY = block.size.height / block.chExt.height
                /**
                 * 先scale再translate
                 */
                childTransform.push(`scale(${scaleX},${scaleY})`) 
            }

            if(block.chOff){
                childTransform.push(`translate(-${block.chOff.x}px, -${block.chOff.y}px)`)
            }

            if(childTransform.length){
                wrapper.style.transform =  childTransform.join(" ")
                wrapper.style.transformOrigin = "left top"
            }

            // let rect = {}

            // block.children.map(c=>{
            //     if(rect.x == undefined){
            //         rect.x = c.position.x
            //         rect.y = c.position.y
            //         rect.r = c.size.width + rect.x
            //         rect.b = c.size.height + rect.y
            //     }
                
            //     rect.x = Math.min(rect.x,c.position.x)
            //     rect.y = Math.min(rect.y,c.position.y)
            //     rect.r = Math.max(rect.r,c.position.x + c.size.width)
            //     rect.b = Math.max(rect.b,c.position.y + c.size.height)
            // })

            // if(rect.x != undefined){
            //     let w = rect.r - rect.x
            //     let h = rect.b - rect.y
            //     let scale = Math.min(block.size.width / w,block.size.height / h)
            //     scale =Math.floor(scale * 10) / 10
            //     // group.style.transform = `scale(${scale})`
            //     group.style.transformOrigin = "left top"
            // }


        }else{
            parseBlock(block,el,pageIndex)
        }
    }

}

for(let i = 0;i<slideJson.slides.length;i++){
    
    let el = document.createElement('div')
    app.appendChild(el)


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



    if(slide.backgroundImage){
        el.style.backgroundImage = `url(${slide.backgroundImage.replace('ppt','')})`
        el.style.backgroundSize = "cover"
    }

    el.style.backgroundColor = "white"

    if(slide.backgroundColor){
        if(slide.backgroundColor.type == "grad"){
            let str = `linear-gradient(to right,${slide.backgroundColor.value.map(c=>{
                return `#${c.color} ${c.pos}%`
            }).join(",")})`
            el.style.background = str
        }else{
            el.style.backgroundColor = "#" + slide.backgroundColor.value
        }
    }
    try {
        parseBlocks(slide.blocks,el,i)

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