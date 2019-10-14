export const hexToRgba = (color) => {
    if (!color) {
        return undefined
    }

    if (color.length !== 8) {
        return '#' + color
    }

    const a = Math.floor(+('0x' + color.substr(0, 2)) * 100 / 255) / 100
    const r = +('0x' + color.substr(2, 2))
    const g = +('0x' + color.substr(4, 2))
    const b = +('0x' + color.substr(6, 2))

    if (a) {
        return `rgba(${r},${g},${b},${a})`
    }
}
