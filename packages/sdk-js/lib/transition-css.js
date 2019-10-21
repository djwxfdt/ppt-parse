
// @flow

import { css } from '@emotion/core'

import { SlideFadeThruBlk, SlideCircle, SlideCoverLd } from './animation-css'

export default (key: string) => {
    switch (key) {
    case 'fade': {
        return css`
            animation: 500ms ${SlideFadeThruBlk} both ease;
        `
    }
    case 'circle': {
        return css`
            animation: 500ms ${SlideCircle} both
        `
    }
    case 'cover': {
        return css`
            animation: 500ms ${SlideCoverLd} both
        `
    }
    }
}
