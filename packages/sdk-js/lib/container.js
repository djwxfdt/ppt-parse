/* eslint-disable no-unused-vars */
// @flow

import React, { useEffect, useRef } from 'react'
import type { BlockType } from './export'
import { hexToRgba } from './utils'
import ShapeElement from './prstShape'
import TextListElement from './texts'
import SvgElement from './custShape'

export default (props: {block: BlockType, style: any}) => {
    const style = Object.assign({}, props.style)
    const block = props.block
    if (block.fontSize) {
        style.fontSize = block.fontSize
    }
    if (block.color) {
        style.color = hexToRgba(block.color)
    }

    let fill = 'transparent'
    if (block.fill) {
        if (block.fill.type === 'solid') {
            fill = hexToRgba(block.fill.value)
        }
    }

    let stroke: any = null
    if (block.line && block.line.color) {
        const borderWidth = block.line.width || 1
        stroke = {
            width: borderWidth,
            color: hexToRgba(block.line.color),
            linejoin: 'round',
            linecap: 'but',
            dasharray: (block.line && block.line.prstDash === 'dot') ? '3,6' : null
        }
    }

    return <div data-type="container" style={style}>
        <ShapeElement block={block} stroke={stroke} />
        {(block.svgs || []).map((svg, i) => {
            return <SvgElement svg={svg} stroke={stroke} key={i} block={block}/>
        })}
        {block.text ? <TextListElement block={block} /> : null}
    </div>
}
