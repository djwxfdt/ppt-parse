## 使用nodejs解析pptx

    xml解析部分使用了c++解析引擎 pugixml，为了解决xml2js在空节点丢弃空格的问题，并加快解析速度

### demo运行

1. npm install
2. npm run build
3. node example/index.js
4. visit http://localhost:9992/test.html
5. 左右键切换页码


### Issue

1. 第16页，文字有点以底部对齐摆放的时候，文字偏下。

2. 第二页，当按照xml解析的规则把line-height设置为1.15的时候，会造成行高偏小。

3. 第六页，bullet char 的样式有点问题

4. 14页的地图

5. 13页的表格


参考文档：
1. [Ecma-376](https://www.ecma-international.org/publications/standards/Ecma-376.htm)
2. [officeopenxml](http://officeopenxml.com)
3. [c-rex.net](https://c-rex.net/projects/samples/ooxml/e1/Part4/OOXML_P4_DOCX_PresentationML_topic_ID0ETTBGB.html)
