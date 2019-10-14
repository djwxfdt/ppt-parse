// @flow

// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef } from 'react'
import { hexToRgba } from './utils'

type Color = {type: 'solid' | 'grad', value: string | Array<{pos: number, value: string}>, ang?: number}

type SlideObj = {
    backgroundColor: Color
}

const setSlideBackground = (target: ?HTMLElement, color: Color) => {
    if (!target) {
        return
    }
    if (color.type === 'grad' && Array.isArray(color.value)) {
        const str = `linear-gradient(${(color.ang || 0) + 90}deg,${color.value.map(c => {
            return `${hexToRgba(c.value)} ${c.pos}%`
        }).join(',')})`
        target.style.background = str
    } else {
        target.style.backgroundColor = hexToRgba(color.value)
    }
}

export default (props: SlideObj) => {
    const slideEl = useRef(null)

    useEffect(() => {
        setSlideBackground(slideEl.current, props.backgroundColor)
    }, [])

    return <div ref={ slideEl } className="pptx_slide" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>

    </div>
}
