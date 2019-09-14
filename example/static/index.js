

/**
 * @type {{size:{width,height},slides:Array<{background:string,blocks:Array<{position:{x,y},size:{width,height},type:string}>}>}}
 */
let slideJson = window.jsonObj


let app = document.getElementById('app')


app.style.width = slideJson.size.width + "px"
app.style.height = slideJson.size.height + "px"

let current = 0
let total = slideJson.slides.length

const valignMap = {
    "bottom":"flex-end"
}

const parseBlock = (block,el) =>{
    if(block.type == "container"){
        let text = document.createElement('div')
        el.appendChild(text)

        text.style.position = "absolute"
        text.style.left = block.position.x + "px"
        text.style.top = block.position.y + "px"
        text.style.width = block.size.width + "px"
        text.style.height = block.size.height + "px"
        if(block.valign != "top"){
            text.style.display = "flex"
            text.style.flexDirection = "column"

            text.style.justifyContent = valignMap[block.valign] || "center"
        }

        if(block.fontSize){
            text.style.fontSize = block.fontSize + "px"
        }

        if(block.color){
            text.style.color = "#" + block.color
        }

        if(block.rot){
            text.style.transform = `rotate(${block.rot}deg)`
        }
       
        if(block.svgs){
            block.svgs.map(svg=>{
                let s = document.createElementNS("http://www.w3.org/2000/svg","svg")
                text.appendChild(s)

                let ele = SVG.adopt(s).size("100%","100%").viewbox(0,0,svg.width,svg.height)

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
                }
            })
        }

        if(block.prstShape  && block.fill ){
            if(block.prstShape == "rect" ){
                let s = document.createElementNS("http://www.w3.org/2000/svg","svg")
                text.appendChild(s)
                let ele = SVG.adopt(s).size("100%","100%").viewbox(0,0,block.size.width,block.size.height)
                ele.rect( block.size.width,block.size.height).fill("#" + block.fill)
            }
            else if(block.prstShape == "roundRect"){
                let s = document.createElementNS("http://www.w3.org/2000/svg","svg")
                text.appendChild(s)
                let ele = SVG.adopt(s).size("100%","100%").viewbox(0,0,block.size.width,block.size.height)
                ele.rect( block.size.width,block.size.height).fill("#" + block.fill).radius(block.size.width / 2)
            }else if(block.prstShape == "ellipse"){
                let s = document.createElementNS("http://www.w3.org/2000/svg","svg")
                text.appendChild(s)
                let ele = SVG.adopt(s).size("100%","100%").viewbox(0,0,block.size.width,block.size.height)
                ele.ellipse( block.size.width,block.size.height).fill("#" + block.fill)
            }
        }

        block.text.map((p,index)=>{
            let div = document.createElement('p')
            // div.style.whiteSpace = "pre"
            if(p.align == "center"){
                div.style.textAlign = "center"
            }
            if(p.color){
                div.style.color = "#" + p.color
            }
            if(p.lnPt){
                div.style.lineHeight = p.lnPt / 100
            }

            if(p.spcBef && index != 0){
                div.style.marginTop = p.spcBef + "px"
            }

            if(p.bullet){
                let bullet = document.createElement("span")
                bullet.innerHTML = p.bullet.char
                bullet.style.fontSize = p.bullet.sz + "px"
                div.appendChild(bullet)
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
                }else{
                    if(t.color){
                        span.style.color = "#" + t.color
                    }
                }
                console.log(t.value)
                let str = t.value.replace(/( )( )/g,"&nbsp&nbsp")
                
                span.innerHTML = str
                if(t.size){
                    span.style.fontSize  = t.size + "px"
                }
                
                if(t.fontFamily){
                    span.style.fontFamily = t.fontFamily
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


                div.appendChild(span)
            })
            
            text.appendChild(div)
        })

    }else if(block.type == "image"){
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

    }
}

/**
 * 
 * @param {Array<{type:string,position,size,chOff,children:Array}>} blocks 
 * @param {*} el 
 * @param {*} chOff 
 */
const parseBlocks = (blocks,el,chOff)=>{
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

            parseBlocks(block.children,wrapper)

            if(block.chOff){
                group.childNodes.forEach(n=>{
                    n.style.marginLeft = `-${block.chOff.x}px`
                    n.style.marginTop = `-${block.chOff.y}px`
                })
                // group.style.paddingLeft = `-${block.chOff.x}px`
                // group.style.paddingTop = `-${block.chOff.y}px`
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
            parseBlock(block,el)
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

    if(slide.backgroundImage){
        el.style.backgroundImage = `url(${slide.backgroundImage.replace('ppt','')})`
        el.style.backgroundSize = "cover"
    }

    if(slide.backgroundColor){
        el.style.backgroundColor = "#" + slide.backgroundColor
    }

    parseBlocks(slide.blocks,el)
   
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