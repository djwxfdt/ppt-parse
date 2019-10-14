// @flow

// eslint-disable-next-line no-unused-vars
import React from 'react'
// eslint-disable-next-line no-unused-vars
import Slide from './slide'

type PPTJSON = {
    size: {width: number, height: number},
    slides: Array<any>
}

const Library = (props: {jsonObj: PPTJSON, currentPage: number}) => {
    const { slides, size } = props.jsonObj

    let page = props.currentPage || 0
    if (page < 0) {
        page = 0
    } else if (page >= slides.length) {
        page = slides.length - 1
    }
    return <div className="pptx_container" style={{ width: size.width, height: size.height, background: 'black', position: 'relative', overflow: 'hidden' }}>
        <Slide {...slides[page]} key={page} pageIndex={page} ></Slide>)
    </div>
}

export default Library
