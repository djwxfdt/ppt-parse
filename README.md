## 使用nodejs解析pptx

    xml解析部分使用了c++解析引擎 pugixml，为了解决xml2js在空节点丢弃空格的问题，并加快解析速度

### demo运行

1. npm install
2. npm run build
3. node example/index.js
4. visit http://localhost:9992/test.html
5. 左右键切换页码


#### 解析效果

http://pptx.dornt.com/test.html 

#### 第三方解析效果

https://ppt2h5-1259648581.file.myqcloud.com/g4f7d5qqc0jcqk8n11mb/index.html

### Issue

1. 第六页，bullet char 的样式有点问题

1. 13页的表格

参考文档：
1. [Ecma-376](https://www.ecma-international.org/publications/standards/Ecma-376.htm)
2. [officeopenxml](http://officeopenxml.com)
3. [c-rex.net](https://c-rex.net/projects/samples/ooxml/e1/Part4/OOXML_P4_DOCX_PresentationML_topic_ID0ETTBGB.html)
