const xml2js = require('xml2js')

/**
 * @param {*} str 
 */
const parseString = Type => str => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(str, {
            attrkey: "attrs",
            childkey: "children",
            explicitChildren:true,
            preserveChildrenOrder:true
        }, (err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(new Type(res))
            }
        })
    })

}

// class Test{
//     constructor(n){
//         debugger
//     }
// }

// parseString(Test)(`<a:r>
// <a:t>1</a:t>
// </a:r>`)

const searchXML = xml => arry => {

    for (let i = 0; i < arry.length; i++) {
        if (!xml) {
            break
        }
        if (Array.isArray(xml)) {
            xml = xml[0][arry[i]]
            continue
        }
        xml = xml[arry[i]]
    }

    return xml
}

module.exports = {searchXML,parseString}