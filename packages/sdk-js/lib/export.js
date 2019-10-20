// @flow

export type Color = {type: 'solid' | 'grad', value: string | Array<{pos: number, value: string}>, ang?: number}

type Line = {
    color: string,
    width: ?number,
    prstDash: ?string
}

type PrstShape = {
    type: 'rect'
}

export type Text = {
    value: ?string,
    link: ?boolean,
    color: ?string,
    size: ?number,
    fontFamily: ?Array<string>,
    valign: ?string,
    bold: ?boolean,
    italic: ?boolean,
    underline: ?boolean,
    highlight: ?string,
    baseline?: number,
    outerShadow: {direction: number, dist: number, blurRad: number, color: string}
}

export type Bullet = {
    char: string,
    font: ?Array<string>,
    sz: ?number,
    color: ?string
}

export type TextCotainer = {
    algn: ?'ctr' | 'r',
    color: Color,
    lnPct: ?number,
    spcBef: ?number,
    marL: ?number,
    indent: ?number,
    children: Array<Text>,
    bullet: ?Bullet,
    isSlideNum: ?Boolean
}

export type Table = {
    trs: Array<{tcs: Array<{body: ?Array<TextCotainer>, ln: Line}>, height: number}>,
    cols: Array<number>
}

export type Svg = {
    width: number,
    height: number,
    points: Array<{t: 'moveTo' | 'lnTo' | 'cubicBezTo' | 'close', x: number, y: number, pts: Array<{x: number, y: number}>}>
}

export type BlockType = {
    type: 'group' | 'container' | 'image' | 'rect' | 'table' | 'oleObj',
    position: {x: number, y: number},
    size: {width: number, height: number},
    fontSize: ?number,
    color: ?Color,
    fill: ?Color,
    prstShape: ?PrstShape,
    line: ?Line,
    rot: ?number,
    valign: ?'top',
    text: ?Array<TextCotainer>,
    src: ?string,
    table: ?Table,
    svgs: ?Array<Svg>,
    children: ?Array<BlockType>
}
