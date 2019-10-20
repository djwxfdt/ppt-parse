/* eslint-disable no-unused-vars */
// @flow

import React, { useEffect, useRef } from 'react'
import type { BlockType } from './export'

import BlockElement from './block'

export default (props: {block: BlockType, style: any, pageIndex: number}) => {
    return <div data-type="group"
        style={{ position: 'absolute', ...props.style }}>
        {(props.block.children || []).map((block, index) => {
            return <BlockElement block={block} key={index} pageIndex={props.pageIndex}/>
        })}
    </div>
}
