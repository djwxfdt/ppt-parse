/* eslint-disable no-unused-vars */
// @flow

import React, { useEffect, useRef } from 'react'

/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { hexToRgba } from './utils'
import type { Color } from './export'
import Block from './block'
import TransitionFn from './transition-css'

type SlideObj = {
    backgroundColor: Color,
    backgroundImage: string,
    blocks: Array<any>,
    pageIndex: number,
    transition: ?{type: string}
}

const setSlideBackground = (target: ?HTMLElement, color: Color, url: ?string) => {
    if (!target) {
        return
    }
    if (url) {
        target.style.backgroundImage = `url(${url})`
        target.style.backgroundSize = 'cover'
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
        setSlideBackground(slideEl.current, props.backgroundColor, props.backgroundImage)
    }, [])

    return <div ref={ slideEl } css={TransitionFn(props.transition && props.transition.type)} className="pptx_slide" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
        {props.blocks.map((block, index) => <Block block={block} key={index} pageIndex={props.pageIndex} />)}
    </div>
}
