

/**
 * @type {{size:{width,height},slides:Array<{background:string,blocks:Array<{position:{x,y},size:{width,height},type:string}>}>}}
 */
let slideJson = window.jsonObj


let app = document.getElementById('app')


app.style.width = slideJson.size.width + "px"
app.style.height = slideJson.size.height + "px"

let current = 0
let total = slideJson.slides.length

for(let i = 0;i<slideJson.slides.length;i++){
    
    let el = document.createElement('div')
    el.style.position = "absolute"
    el.style.width = "100%"
    el.style.height = "100%"
    if(i==0){
        el.style.display = "block"
    }else{
        el.style.display = "none"
    }

    let slide = slideJson.slides[i]

    for(let j=0;j<slide.blocks.length;j++){
        let block = slide.blocks[j]
        if(block.type == "container"){
            let text = document.createElement('div')
            text.style.position = "absolute"
            text.style.left = block.position.x + "px"
            text.style.top = block.position.y + "px"
            text.style.width = block.size.width + "px"
            text.style.height = block.size.height + "px"
            if(block.valign != "top"){
                text.style.display = "flex"
                text.style.flexDirection = "column"
                text.style.justifyContent = "center"
            }
           

            block.text.map((d,index)=>{
                let div = document.createElement('p')
                // div.style.whiteSpace = "pre"
                if(d.align == "center"){
                    div.style.textAlign = "center"
                }
                if(d.color){
                    div.style.color = "#" + d.color
                }
                if(d.lnPt){
                    div.style.lineHeight = d.lnPt / 100
                }

                if(d.spcBef && index != 0){
                    div.style.marginTop = d.spcBef + "px"
                }

                d.children.map((t)=>{
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

            el.appendChild(text)
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

    app.appendChild(el)
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