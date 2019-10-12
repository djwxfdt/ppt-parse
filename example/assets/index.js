import parseBlock from "./parse-block"
const {hexToRgba} = require("./utils")


/**
 * @type {{size:{width,height},slides:Array<{background:string,blocks:Array<{position:{x,y},size:{width,height},type:string}>}>}}
 */
let slideJson = window.jsonObj


let app = document.getElementById('app')
let scaleWrapper = document.getElementById('wapper')


app.style.width = slideJson.size.width + "px"
app.style.height = slideJson.size.height + "px"

let current = 0
let total = slideJson.slides.length

const resize = ()=>{
    let w = window.innerWidth
    let h = window.innerHeight

    let scale = Math.min(w / slideJson.size.width,h /slideJson.size.height)

    if(scale < 1){
        scaleWrapper.style.transform = `scale(${scale})`
        scaleWrapper.style.transformOrigin = "center"
    }

}

resize()


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

/**
 * 
 * @param {Array<{type:string,position,size,chOff,children:Array}>} blocks 
 * @param {*} el 
 * @param {*} pageIndex 
 */
const parseBlocks = (blocks, el, pageIndex) => {
    for (let j = 0; j < blocks.length; j++) {
        let block = blocks[j]
        if (block.type == "group") {
            let group = document.createElement("div")
            group.style.position = "absolute"
            group.style.left = block.position.x + "px"
            group.style.top = block.position.y + "px"
            group.style.width = block.size.width + "px"
            group.style.height = block.size.height + "px"


            let wrapper = document.createElement("div")
            wrapper.setAttribute("data-type", "group")
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

            parseBlocks(block.children, wrapper, pageIndex)


            // if(childTransform.length){
            //     wrapper.style.transform =  childTransform.join(" ")
            //     wrapper.style.transformOrigin = "left top"
            // }



        } else {
            parseBlock(block, el, pageIndex,currentSlideEl)
        }
    }

}

for (let i = 0; i < slideJson.slides.length; i++) {

    let el = document.createElement('div')
    app.appendChild(el)
    currentSlideEl = el

    el.style.position = "absolute"
    el.style.width = "100%"
    el.style.height = "100%"
    if (i == 0) {
        el.style.display = "block"
    } else {
        el.style.display = "none"
    }



    let slide = slideJson.slides[i]

    switch (slide.transition && slide.transition.type) {
        case "fade": {
            el.setAttribute("class", "slide-fade-thruBlk")
            break
        }
        case "circle": {
            el.setAttribute("class", "slide-circle")
            break
        }
        case "cover": {
            el.setAttribute("class", `slide-cover-${slide.transition.dir}`)

            break
        }
        default: {
            el.setAttribute("class", "slide")
        }
    }

    el.style.backgroundColor = "white"

    let wrapper = document.createElement("div")
    wrapper.style.position = "absolute"
    wrapper.style.left = wrapper.style.top = "0"
    wrapper.style.width = wrapper.style.height = "100%"

    el.appendChild(wrapper)



    if (slide.backgroundImage) {
        wrapper.style.backgroundImage = `url(${slide.backgroundImage.replace('ppt', '')})`
        wrapper.style.backgroundSize = "cover"
    }


    if (slide.backgroundColor) {
        if (slide.backgroundColor.type == "grad") {
            let str = `linear-gradient(${(slide.backgroundColor.ang || 0) + 90}deg,${slide.backgroundColor.value.map(c => {
                return `${hexToRgba(c.value)} ${c.pos}%`
            }).join(",")})`
            wrapper.style.background = str
        } else {
            wrapper.style.backgroundColor = hexToRgba(slide.backgroundColor.value)
        }
    }
    try {
        parseBlocks(slide.blocks, wrapper, i)

    } catch (error) {
        console.error(error)
    }


}


const goNext = () => {
    current++
    app.childNodes.forEach((el, index) => {
        el.style.display = "none"
        if (current == index) {
            el.style.display = "block"
        }
    })
}
const goPrev = () => {
    current--
    app.childNodes.forEach((el, index) => {
        el.style.display = "none"
        if (current == index) {
            el.style.display = "block"
        }
    })
}


window.addEventListener("keyup", e => {
    if (e.keyCode == 39) {
        e.preventDefault()
        goNext()
    } else if (e.keyCode == 37) {
        e.preventDefault()
        goPrev()
    }
})

document.getElementById("app").addEventListener("click", e => {
    goNext()
})