/* eslint-disable no-unused-vars */
// @flow

import React, { useEffect, useRef } from 'react'
import type { BlockType } from './export'
import { TextContainer } from './texts'
import { hexToRgba } from './utils'

export default (props: {block: BlockType, style: any, pageIndex: number}) => {
    if (!props.block.table) {
        return null
    }
    const table = props.block.table
    return <table cellSpacing='0' style={props.style} >
        <tbody>
            {table.trs.map((tr, j) => {
                return <tr style={{ height: tr.height }} key={j}>
                    {tr.tcs.map((tc, i) => {
                        const tdStyle = {}
                        if (tc.ln) {
                            tdStyle.border = `dashed 1px ${hexToRgba(tc.ln.color) || '#FFF'}`
                            tdStyle.boxSizing = 'border-box'
                            if (j !== (table.trs.length - 1)) {
                                tdStyle.borderBottom = 'none'
                            }
                            if (i !== (tr.tcs.length - 1)) {
                                tdStyle.borderRight = 'none'
                            }
                        }
                        return <td style={{ width: table.cols[i] }} key={i} style={tdStyle}>
                            {tc.body && tc.body.map((p, k) => {
                                return <TextContainer text={p} index={k} key={k} pageIndex={props.pageIndex}/>
                            })}
                        </td>
                    })}
                </tr>
            })}
        </tbody>
    </table>
}
