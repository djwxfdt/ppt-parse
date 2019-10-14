/* eslint-disable no-unused-vars */
// @flow

import React, { useEffect, useRef } from 'react'
import type { BlockType } from './export'

import BlockElement from './block'

export default (props: BlockType) => {
    return <div data-type="group"
        style={{ position: 'absolute', left: props.position.x, top: props.position.y, ...props.size }}>

    </div>
}
