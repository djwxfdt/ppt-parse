/* eslint-disable no-unused-vars */
// @flow

import React, { useEffect, useRef } from 'react'
import { hexToRgba } from './utils'
import SVG from 'svg.js'
import type { BlockType } from './export'

const RectSvg = (props: {block: BlockType, stroke: ?any}) => {
    let fill = 'transparent'

    const svgRef = useRef()
    const { width, height } = props.block.size
    const block = props.block

    useEffect(() => {
        const ele = SVG.adopt(svgRef.current)

        if (block.fill) {
            if (block.fill.type === 'solid') {
                fill = hexToRgba(block.fill.value)
            }
            if (block.fill && block.fill.type === 'grad') {
                fill = ele.gradient('linear', stop => {
                    if (block.fill && Array.isArray(block.fill.value)) {
                        block.fill.value.map(v => {
                            stop.at(v.pos / 100, v.value)
                        })
                    }
                })
            }
        }

        const rt = ele.size('100%', '100%').viewbox(0, 0, width, height).rect(width, height).fill(fill)
        if (props.stroke) {
            rt.stroke(props.stroke)
        }
    }, [])

    return <svg ref={svgRef}>

    </svg>
}

export default (props: {block: BlockType, stroke: any}) => {
    if (!props.block.prstShape) {
        return null
    }
    switch (props.block.prstShape.type) {
    case 'rect': {
        return <RectSvg block={props.block} stroke={props.stroke} />
    }
    default: {
        return null
    }
    }
}
