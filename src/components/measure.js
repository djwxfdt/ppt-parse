const Pt2PIX = pt => pt / 3 * 4

module.exports.EMU2PIX = emus => {
    if (isNaN(emus)) {
        return undefined
    }

    return Pt2PIX(+emus / 12700)
}

module.exports.Angle2Degree = (angle = 0) => Math.round(angle / 60000)
