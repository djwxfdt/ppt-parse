

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
    let div = document.createElement('p')
    div.style.zIndex = "1"
    // div.style.whiteSpace = "pre"
    if( p.algn == "ctr"){
        div.style.textAlign = "center"
    }
    if(p.color){
        div.style.color = "#" + p.color
    }
    if(p.lnPct){
        div.style.lineHeight = p.lnPct / 100
    }

    if(p.spcBef && index != 0){
        div.style.marginTop = p.spcBef + "px"
    }

    let container = div

    if(p.bullet){
        let bullet = document.createElement("span")
        bullet.innerHTML = p.bullet.char
        bullet.style.fontSize = p.bullet.sz + "px"
        // bullet.style.height = p.bullet.sz + "px"
        // bullet.style.display = "flex"
        // bullet.style.alignItems = "center"
        div.appendChild(bullet)

        if(p.bullet.color){
            bullet.style.color = "#" + p.bullet.color
        }

        div.style.display = "flex"

        container = document.createElement("span")

        div.appendChild(container)
    }

    if(p.algn == "r"){
        div.style.textAlign = "right"
    }
    


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
            span.style.fontFamily = t.fontFamily + ",Helvetica"
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


        container.appendChild(span)
    })

   

    return div
}

const parseBlock = (block,el,pageIndex) =>{
    if(block.type == "container"){
        let wrapper = document.createElement('div')

        if(block.id){
            wrapper.setAttribute("data-id",block.id)
        }
        el.appendChild(wrapper)

        wrapper.style.position = "absolute"
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

                if(block.ln){
                    if(block.ln.color){
                        ele.attr("stroke","#" + block.ln.color)
                    }
                    if(block.ln.width){
                        ele.attr("stroke-width",block.ln.width )
                        ele.attr("stroke-linecap","butt")
                    }
                    if(block.ln.round){
                        ele.attr("stroke-linejoin","round")
                    }
                    if(block.ln.prstDash == "dot"){
                        ele.attr("stroke-dasharray","3,6")
                    }
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
                    ps.fill("#" + block.fill)
                }else{
                    ps.fill("transparent")
                }
            })
        }

        if(block.prstShape  && block.fill ){
            let s = document.createElementNS("http://www.w3.org/2000/svg","svg")
            wrapper.appendChild(s)
            s.style.position = "absolute"
            s.style.left = "0"
            s.style.top = "0"
            let ele = SVG.adopt(s).size("100%","100%").viewbox(0,0,block.size.width,block.size.height)

            if(block.prstShape.type == "rect" ){
                ele.rect( block.size.width,block.size.height).fill("#" + block.fill)
            }
            else if(block.prstShape.type == "roundRect"){
                ele.rect( block.size.width,block.size.height).fill("#" + block.fill).radius(block.size.width / 2)
            }else if(block.prstShape.type == "ellipse"){
                ele.ellipse( block.size.width,block.size.height).fill("#" + block.fill)
            }else if(block.prstShape.type == "donut"){
                let grad = ele.gradient("radial",stop=>{
                    stop.at(0,"transparent")
                    stop.at(0.1,"white")
                    stop.at(0.3,"white")
                    stop.at(0.3,"#" + block.fill)
                    stop.at(0.8,"#" + block.fill)
                    stop.at(0.8,"white")
                    stop.at(1,"white")
                })
                ele.circle(block.size.width).center(block.size.width / 2,block.size.height / 2).fill(grad)
            }else if("round2SameRect" == block.prstShape.type ){
                ele.rect( block.size.width,block.size.height).fill("#" + block.fill)
                s.style.borderTopLeftRadius = "10px"
                s.style.borderTopRightRadius = "10px"
            }else if("pie" == block.prstShape.type){
                s.style.borderRadius = "50%"
                let pie = ele.circle(block.size.width).fill("#" + block.fill)
                let c = Math.PI * block.size.width
                pie.attr({"stroke-dasharray":`${c/4} ${c}`,"stroke":"white","stroke-width":block.size.width,"stroke-dashoffset":c/4*3})
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

    parseBlocks(slide.blocks,el,i)
   
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