/* eslint-disable no-unused-vars */
// @flow

import React, { useEffect, useRef } from 'react'
import { hexToRgba } from './utils'
import SVG from 'svg.js'
import type { BlockType } from './export'

const BaseSvg = (props: {block: BlockType, stroke: ?any}) => (callback: (svg: SVG.Element, fill: string, stroke: any)=>void) => {
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
        const sv = ele.size('100%', '100%').viewbox(0, 0, width, height)
        callback(sv, fill, props.stroke || {})
    }, [])

    return <svg ref={svgRef}>

    </svg>
}

const DonutSvg = (props: {block: BlockType, stroke: ?any}) => {
    const { width, height } = props.block.size
    return BaseSvg(props)((svg, fill) => {
        const grad = svg.gradient('radial', stop => {
            stop.at(0, 'transparent')
            stop.at(0.1, 'white')
            stop.at(0.3, 'white')
            stop.at(0.3, fill)
            stop.at(0.8, fill)
            stop.at(0.8, 'white')
            stop.at(1, 'white')
        })
        svg.circle(width).center(width / 2, height / 2).fill(grad)
    })
}

const RectSvg = (props: {block: BlockType, stroke: ?any}) => {
    return BaseSvg(props)((svg, fill, stroke) => {
        svg.rect(props.block.size.width, props.block.size.height).fill(fill).stroke(stroke)
    })
}

const RoundRectSvg = (props: {block: BlockType, stroke: ?any}) => {
    const { width, height } = props.block.size
    return BaseSvg(props)((svg, fill, stroke) => {
        svg.rect(width, height).fill(fill).stroke(stroke).radius(Math.min(width / 2, height / 2))
    })
}

const Round2SameRect = (props: {block: BlockType, stroke: ?any}) => {
    const { width, height } = props.block.size
    return BaseSvg(props)((svg, fill, stroke) => {
        svg.rect(width, height).fill(fill)
        svg.node.style.borderTopLeftRadius = '10px'
        svg.node.style.borderTopRightRadius = '10px'
    })
}

const Ellipse = (props: {block: BlockType, stroke: ?any}) => {
    const { width, height } = props.block.size
    return BaseSvg(props)((svg, fill, stroke) => {
        svg.ellipse(width, height).fill(fill)
    })
}

const Pie = (props: {block: BlockType, stroke: ?any}) => {
    const { width, height } = props.block.size
    return BaseSvg(props)((svg, fill, stroke) => {
        const pie = svg.circle(width).fill(fill)
        const c = Math.PI * width
        svg.node.style.borderRadius = '50%'
        /**
         * TODO 这里需要重新写
         */
        pie.attr({ 'stroke-dasharray': `${c / 4} ${c}`, stroke: 'white', 'stroke-width': width, 'stroke-dashoffset': c / 4 * 3 })
    })
}

export default (props: {block: BlockType, stroke: any}) => {
    if (!props.block.prstShape) {
        return null
    }
    switch (props.block.prstShape.type) {
    case 'rect': {
        return <RectSvg block={props.block} stroke={props.stroke} />
    }
    case 'ellipse': {
        return <Ellipse block={props.block} stroke={props.stroke} />
    }
    case 'pie': {
        return <Pie block={props.block} stroke={props.stroke} />
    }
    case 'roundRect': {
        return <RoundRectSvg block={props.block} stroke={props.stroke} />
    }
    case 'round2SameRect': {
        return <Round2SameRect block={props.block} stroke={props.stroke} />
    }
    case 'donut': {
        return <DonutSvg block={props.block} stroke={props.stroke} />
    }
    default: {
        return null
    }
    }
}
