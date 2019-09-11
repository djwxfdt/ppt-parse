## 使用nodejs解析pptx

### demo运行

1. npm install
2. node example/index.js
3. visit http://localhost:9992/test.html


### Issue

1. 第四页，title按照实际大小显示的时候，会超出shape的宽高，需要对文字进行缩放，怎么做是个问题。

2. 第二页，当按照xml解析的规则把line-height设置为1.15的时候，会造成行高偏小。

参考文档：
1. [Ecma-376](https://www.ecma-international.org/publications/standards/Ecma-376.htm)
2. [officeopenxml](http://officeopenxml.com)
3. [c-rex.net](https://c-rex.net/projects/samples/ooxml/e1/Part4/OOXML_P4_DOCX_PresentationML_topic_ID0ETTBGB.html)
