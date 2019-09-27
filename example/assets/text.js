module.exports.parseTxBody = (p,index) =>{
    let pWrapper = document.createElement('div')
    pWrapper.style.zIndex = "1"
    pWrapper.style.position = "relative"

    // div.style.whiteSpace = "pre"
    if( p.algn == "ctr"){
        pWrapper.style.textAlign = "center"
    }
    if(p.color){
        pWrapper.style.color = p.color
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
            bullet.style.color = p.bullet.color
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
            span.style.color =  t.color
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
            span.style.backgroundColor =  t.highlight
        }

        if(t.baseline){
            span.style.verticalAlign = t.baseline + "%"
        }

        if(t.outerShadow){
            span.style.textShadow = `${Math.cos(t.outerShadow.direction) * t.outerShadow.dist}px ${Math.sin(t.outerShadow.direction) * t.outerShadow.dist}px ${t.outerShadow.blurRad}px ${t.outerShadow.color}`
        }

        textsEl.appendChild(span)
    })

   

    return pWrapper
}