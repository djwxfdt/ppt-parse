class XElement{
    constructor(xml) {
        /**
         * @private
         * @type {{[key:string]:XElement}}
         */
        this._map = {}
        this._rawXml = xml
        this._attrs = {}

        /**
         * @type {Array<{#name:string}>}
         */
        this.children = []

        if(typeof xml  === "object"){
            for(let key in xml){
                if(key == "attrs"){
                    this._attrs = xml[key]
                }
                if(key == "children"){
                    this.children = xml[key]
                    continue
                }
                this._map[key] = XElement.init(xml[key])
            }
        }
    }

    get attributes(){
        return this._attrs
    }
    
    /**
     * 
     * @returns {XElement}
     */
    static init(xml){
        if(!xml){
            return null
        }
        if(Array.isArray(xml)){
            return xml.map(item=>XElement.init(item)).filter(i=>i)
        }
        if(typeof xml === "object"){
            if(Object.keys(xml).length == 0){
                return null
            }
            return new XElement(xml)
        }
        return xml
    }

    get elements(){
        return this._map
    }

    /**
     * 
     * @param {(key:string,x:XElement)=>void} callback 
     */
    map(callback){
        for(let key in this._map){
            callback(key,this.get(key))
        }
    }

    /**
     * @returns {XElement} 
     */
    get(key){
        return this._map[key]
    }

    /**
     * @returns {XElement} 
     */
    getSingle(key){
        let res = this.get(key)
       
        if(Array.isArray(res)){
            return res[0]
        }

        return res
    }
    

    /**
     * @param {Array<string>} arry 
     * @returns {XElement}
     */
    selectFirst(arry){
        let tmp = this.selectArray(arry)
        return tmp[0]
    }

    /**
     * @param {Array<string>} arry 
     * @returns {Array<XElement>}
     */
    selectArray(arry){
        let xml = this
        for (let i = 0; i < arry.length; i++) {
            if (!xml) {
                break
            }

            let key = arry[i]

            if(xml instanceof XElement){
                xml = xml.get(key)
                continue
            }

            if (Array.isArray(xml)) {
                xml = xml[0]
            }

            if(xml instanceof XElement){
                xml = xml.get(key)
            }else{
                xml = null
                break
            }
        }
    
        if(!xml){
            return []
        }else if(Array.isArray(xml)){
            return xml
        }else{
            return [xml]
        }

    }

    /**
     * 
     * @param {XElement} el
     * @returns {XElement} 
     */
    add(el){

    }

}


module.exports = XElement