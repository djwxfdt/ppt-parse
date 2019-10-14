#include <iostream>
#include "./tinyxml2/tinyxml2.h"
#include "rapidxml-1.13/rapidxml.hpp"
#include "./pugixml-1.10/src/pugixml.hpp"

using namespace tinyxml2;
using namespace rapidxml;
using namespace pugi;

int main(){

    // XMLDocument doc(true,COLLAPSE_WHITESPACE) ;
    // doc.Parse("<t>   </t>");

    // auto root = doc.FirstChildElement();

    // auto text = root->GetText();

    // std::cout << text << std::endl;

    // auto value = root->Value();

    // std::cout << value << std::endl;


    // auto name = root->Name();

    // std::cout << name << std::endl;

    // xml_document<> doc;
    char str[] = "<t>  </t>";
    // doc.parse<0>(str);
    // xml_node<> *node = doc.first_node();
    // std::cout << "x" << node->name() << "x" <<  std::endl;

    // std::cout << "x" << node->value() << "x" <<  std::endl;

    pugi::xml_document doc;

    auto result = doc.load_string(str,parse_ws_pcdata);

    auto node = doc.first_child();

    std::cout << "x" << result.description() << "x" <<  std::endl;
    std::cout << "x" << node.first_child().value() << "x" <<  std::endl;


    return 0;
}