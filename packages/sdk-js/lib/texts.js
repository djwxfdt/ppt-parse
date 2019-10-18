/* eslint-disable no-unused-vars */
// @flow

import React, { useEffect, useRef } from 'react'
import type { BlockType, TextCotainer, Text, Bullet } from './export'
import { hexToRgba } from './utils'

const valignMap = {
    bottom: 'flex-end',
    center: 'center'
}

const TextSpan = (props: { text: Text }) => {
    const style = {}
    const t = props.text
    if (t.link) {
        // span = document.createElement('a')
        // span.setAttribute('href', '#')
    }

    style.color = hexToRgba(t.color)
    style.whiteSpace = 'pre-wrap'

    const str = t.value
    if (t.size) {
        style.fontSize = t.size + 'px'
    }
    if (t.fontFamily) {
        style.fontFamily = t.fontFamily.join(',')
    }
    if (t.valign) {
        style.verticalAlign = t.valign + '%'
    }
    if (t.bold) {
        style.fontWeight = 'bold'
    }
    if (t.italic) {
        style.fontStyle = 'italic'
    }
    if (t.underline) {
        style.textDecoration = 'underline'
    }
    if (t.highlight) {
        style.backgroundColor = t.highlight
    }
    if (t.baseline) {
        style.verticalAlign = t.baseline + '%'
    }
    if (t.outerShadow) {
        style.textShadow = `${Math.cos(t.outerShadow.direction) *
            t.outerShadow.dist}px ${Math.sin(t.outerShadow.direction) *
            t.outerShadow.dist}px ${t.outerShadow.blurRad}px ${hexToRgba(
            t.outerShadow.color
        )}`
    }

    return <span style={style}>{t.value}</span>
}

const BulletWrapper = (props: {bullet: ?Bullet, color: ?string, sz: ?number}) => {
    if (!props.bullet) {
        return null
    }
    if (props.bullet.char === '-') {
        props.bullet.char = 1 + '.'
    }
    const style = {}
    style.fontSize = props.bullet.sz || props.sz
    style.color = props.bullet.color || props.color
    if (props.bullet.font) {
        style.fontFamily = props.bullet.font.join(',')
    }
    return <div data-type="bullet-wrapper" style={style}>
        <span>{props.bullet.char || ''}</span>
    </div>
}

export const TextContainer = (props: { text: TextCotainer, index: number }) => {
    const style = {}
    const p = props.text
    if (p.algn === 'ctr') {
        style.textAlign = 'center'
    } else if (p.algn === 'r') {
        style.textAlign = 'right'
    }
    style.color = hexToRgba(p.color)
    if (p.lnPct) {
        style.lineHeight = p.lnPct / 100
    }

    const innerStyle = {}
    if (p.spcBef && props.index !== 0) {
        innerStyle.marginTop = p.spcBef + 'px'
    }
    const marL = (p.marL || 0) + (p.indent || 0)
    if (marL) {
        innerStyle.marginLeft = marL + 'px'
    }
    if ((p.children || []).length === 0) {
        return null
    }

    return (
        <div
            data-type="text-container"
            style={{ position: 'relative', zIndex: 1, ...style, display: 'flex' }}
        >
            <BulletWrapper bullet={props.text.bullet} color={p.children[0].color} sz={p.children[0].size}></BulletWrapper>
            <div style={innerStyle}>
                {(p.children || []).map((r, index) => {
                    return <TextSpan text={r} key={index} />
                })}
            </div>
        </div>
    )
}

export default (props: { block: BlockType }) => {
    const style = {}
    if (props.block.valign !== 'top') {
        style.display = 'flex'
        style.flexDirection = 'column'
        style.justifyContent = valignMap[props.block.valign || 'center']
    }
    return (
        <div
            data-type="texts-wrapper"
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                ...style
            }}
        >
            {(props.block.text || []).map((text, index) => {
                return <TextContainer text={text} index={index} key={index} />
            })}
        </div>
    )
}
