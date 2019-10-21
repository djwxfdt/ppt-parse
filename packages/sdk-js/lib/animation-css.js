// @flow

import { keyframes } from '@emotion/core'

export const SlideCircle = keyframes` 
    from{
        clip-path: ellipse(0% 0% at 50% 50%);
    }
    
    to{
        clip-path: ellipse(100% 100% at 50% 50%);
    }
`

export const SlideCoverLd = keyframes`
    from{
        transform: translate(100%,-100%);
    }
    to{
        transform: translate(0,0);
    }
`

export const SlideFadeThruBlk = keyframes`
    from{
        opacity: 0;
    }
    20%{
        opacity: 0;
    }
    to{
        opacity: 1;
    }
`
