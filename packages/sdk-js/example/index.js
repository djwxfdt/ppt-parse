/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom'
import Library from '../lib/index'

const slideJson = require('../../../example/pptOutput1/output.json')

const scaleWrapper = document.createElement('div')

document.body.appendChild(scaleWrapper)

document.body.style.display = 'flex'
document.body.style.alignItems = 'center'
document.body.style.justifyContent = 'center'
document.body.style.width = '100vw'
document.body.style.height = '100vh'

const resize = () => {
    const w = window.innerWidth - 20
    const h = window.innerHeight - 20

    const scale = Math.min(w / slideJson.size.width, h / slideJson.size.height)

    if (scale < 1) {
        scaleWrapper.style.transform = `scale(${scale})`
        scaleWrapper.style.transformOrigin = 'center'
    }

    scaleWrapper.style.border = 'solid 1px gray'
}

window.addEventListener('resize', () => resize())

resize()

ReactDOM.render(<Library jsonObj={slideJson} />, scaleWrapper)
