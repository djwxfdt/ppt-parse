/* eslint-disable no-unused-vars */
// @flow

import React, { useEffect, useRef } from 'react'
import type { BlockType } from './export'
import GroupElement from './group'
import ContainerElement from './container'
import ImageElement from './image'

export default (props: {block: BlockType}) => {
    const block = props.block
    const style = {}
    style.position = 'absolute'
    if (block.rot) {
        style.transform = `rotate(${block.rot}deg)`
    }
    if (block.position) {
        style.left = block.position.x
        style.top = block.position.y
    }
    if (block.size) {
        style.width = block.size.width
        style.height = block.size.height
    }

    switch (props.block.type) {
    case 'group': {
        return <GroupElement {...props.block} />
    }
    case 'image': {
        return <ImageElement block={props.block} style={style}/>
    }
    case 'container': {
        return <ContainerElement block={props.block} style={style} />
    }
    default: {
        return <div></div>
    }
    }
}
