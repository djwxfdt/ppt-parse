/* eslint-disable no-unused-vars */
// @flow

import React, { useEffect, useRef } from 'react'
import { hexToRgba } from './utils'
import SVG from 'svg.js'
import type { Svg, BlockType } from './export'

export default (props: {svg: Svg, stroke: ?any, block: BlockType}) => {
    let fill = 'transparent'

    const svgRef = useRef()
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

        const rt = ele.size('100%', '100%').viewbox(0, 0, props.svg.width, props.svg.height)
        const str = props.svg.points.map(g => {
            if (g.t === 'moveTo') {
                return `M${g.x},${g.y}`
            } else if (g.t === 'lnTo') {
                return `L${g.x},${g.y}`
            } else if (g.t === 'cubicBezTo') {
                const pts = g.pts.map(({ x, y }) => {
                    return `${x},${y}`
                }).join(' ')
                return `C ${pts}`
            } else if (g.t === 'close') {
                return ''
            }
        }).filter(i => !!i).join(' ')
        const ps = rt.path(str)
        ps.fill(fill)

        if (props.stroke) {
            rt.stroke(props.stroke)
        }
    }, [])

    return <svg ref={svgRef} style={{ position: 'absolute', left: '0', top: '0' }}>

    </svg>
}
