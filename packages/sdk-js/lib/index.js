// @flow

// eslint-disable-next-line no-unused-vars
import React from 'react'
// eslint-disable-next-line no-unused-vars
import Slide from './slide'

type PPTJSON = {
    size: {width: number, height: number},
    slides: Array<any>
}

const Library = (props: {jsonObj: PPTJSON}) => {
    const { slides, size } = props.jsonObj
    return <div className="pptx_container" style={{ width: size.width, height: size.height, background: 'black', position: 'relative', overflow: 'hidden' }}>
        {slides.map((slide, index) => <Slide {...slide} key={index} pageIndex={index} ></Slide>)}
    </div>
}

export default Library
