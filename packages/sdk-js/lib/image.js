/* eslint-disable no-unused-vars */
// @flow

import React, { useEffect, useRef } from 'react'
import type { BlockType } from './export'

export default (props: {block: BlockType, style: any}) => {
    return <img src={props.block.src} style={props.style} >

    </img>
}
