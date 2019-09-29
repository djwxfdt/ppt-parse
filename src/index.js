const decompress = require('decompress')

const path  = require('path')

const xml = require('./xml')

class PPTParseSDK{
    constructor(){
        this.outputPath = path.join(__dirname,'../example/pptOutput1')
    }

    async parsePPT(pptname){
        let files = await decompress(pptname,this.outputPath)


        let relsFile = files.find(item=>item.type == "file" && item.path == "ppt/_rels/presentation.xml.rels")
        let relXml = await xml.parseRelsXML(relsFile.data.toString())

        let themePath = relXml.themePath
        let themeFile = files.find(item=>item.type == "file" && item.path == `ppt/${themePath}`)
        let themeXml = await xml.parseThemeXML(themeFile.data.toString())

        let presentaionFile = files.find(item=>item.path == 'ppt/presentation.xml' )
        let presentationXML = await xml.parseRresentaionXML(presentaionFile.data.toString())

        let slideFiles = files.filter(item=>/ppt\/slides\/slide[\d]+.xml$/.test(item.path)).sort((f1,f2)=>{
            let n1 = +/\d+/.exec(f1.path)[0]
            let n2 = +/\d+/.exec(f2.path)[0]
            return n1 - n2
        })

        let vmls = files.filter(item=>item.path.indexOf("drawings/vmlDrawing") > -1)

        this.vmls = []

        for(let i=0;i<vmls.length;i++){
            this.vmls.push(await xml.parseVmlXML(vmls[i].data.toString()))
        }

        this.presentationXML = presentationXML
        this.presentationXML.rel = relXml
        this.themeXml = themeXml

        /**
         * @type {Array<import('./slide')>}
         */
        this.slideXmlS = []
        for(let i = 0;i<slideFiles.length;i++){
            if(i != 22){
                // continue
            }
            let XML = await xml.parseSlideXML(slideFiles[i].data.toString())
            let relPath = slideFiles[i].path.replace('slides/slide', 'slides/_rels/slide') + '.rels'
            let relFile = files.find(f=>f.path == relPath)
            XML.rel = await xml.parseSlideRelXML(relFile.data.toString())




            let layoutPath = XML.rel.layoutPath
            let layoutFile = files.find(f=>f.path == layoutPath)

            XML.layout = XML.next = await xml.parseSlideLayoutXML(layoutFile.data.toString())

            let layoutRelPath = layoutFile.path.replace('slideLayouts/slideLayout', 'slideLayouts/_rels/slideLayout') + '.rels'
            let layoutRelFile = files.find(f=>f.path == layoutRelPath)
            let layoutRel = await xml.parseSlideLayoutRelXML(layoutRelFile.data.toString())
            XML.layout.rel = layoutRel

            let masterPath = layoutRel.masterPath
            let masterFile = files.find(f=>f.path == masterPath)

            if(masterFile){
                XML.master =  XML.layout.next = await xml.parseSlideMaterXML(masterFile.data.toString())

                let masterRelPath = masterPath.replace('slideMasters/slideMaster','slideMasters/_rels/slideMaster')+ '.rels'
                let masterRelFile = files.find(f=>f.path == masterRelPath)
                let masterRel = await xml.parseSlideLayoutRelXML(masterRelFile.data.toString())
                XML.master.rel = masterRel
            }

            XML.theme = themeXml

            XML.presentation = presentationXML

            XML.pageIndex = i

            XML.vmls = this.vmls


            this.slideXmlS.push(XML)
        }


        // this.zipFiles = files.map(file=>file.path)

            // this.presentationXML  = this.zipFiles.find(str=> str == 'ppt/presentation.xml')

            // this.slidesFolder = this.zipFiles.filter(str=>str.indexOf('ppt/slides/') == 0)

            // this.presentaion.init({
            //     presentaion:this.presentationXML,
            //     slidesFolder:this.slidesFolder,
            //     folder:this.outputPath
            // })
    }

    get json(){
        return  {
            size:this.presentationXML.slideSize,
            slides:this.slideXmlS.map(xml=>{
                return xml.nodes
            }),
            fonts:this.presentationXML.fonts
        }
    }

    


    endsWith(str, mat) {
        var m = str.match(mat + "$");
        if (m) {
            return m.join('') === mat;
        }
        return false;
    }
}

module.exports = PPTParseSDK


// let sdk = new PPTParseSDK()

// sdk.parsePPT(path.join(__dirname,'../example/第8章空中课堂.pptx'))

