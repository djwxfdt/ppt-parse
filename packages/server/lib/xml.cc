// #include <node/node.h>
#include <node.h>

// #include "rapidxml-1.13/rapidxml.hpp"

// #include "./tinyxml2/tinyxml2.h"

#include "pugixml-1.10/src/pugixml.hpp"

#include <iostream>

namespace XML{
    using v8::FunctionCallbackInfo;

    using v8::Isolate;
    using v8::Local;
    using v8::NewStringType;
    using v8::Object;
    using v8::String;
    using v8::Value;
    using v8::Context;
    using v8::Array;


    // using namespace rapidxml;

    // using namespace tinyxml2;

    // void ToObject(xml_node<> *node,Local<Object> & obj,Isolate* isolate, Local<Context> & context){
    //     Local<Object> attributes = Object::New(isolate);

    //     for (xml_attribute<> *attr = node->first_attribute();attr; attr = attr->next_attribute())
    //     {

    //         attributes->Set(
    //             String::NewFromUtf8(isolate,attr->name()),
    //             String::NewFromUtf8(isolate,attr->value())
    //         );
    //     }
    //     obj->Set(String::NewFromUtf8(isolate,"attrs"),attributes);

    //     obj->Set(String::NewFromUtf8(isolate,"name"),String::NewFromUtf8(isolate,node->name()));

    //     obj->Set(String::NewFromUtf8(isolate,"value"),String::NewFromUtf8(isolate,node->value()));

    //     Local<Array> children = Array::New(isolate);

    //     int i = 0;
    //     for(xml_node<> *child = node->first_node();child;child=child->next_sibling()){
    //         Local<Object> cObj = Object::New(isolate);
    //         ToObject(child,cObj,isolate,context);
    //         children->Set(i,cObj);
    //         i++;
    //     }
        
    //     obj->Set(String::NewFromUtf8(isolate,"children"),children);

    // }

    // void ToObject2(const XMLElement *node,Local<Object> & obj,Isolate* isolate){
    //     Local<Object> attributes = Object::New(isolate);
        

    //     for (const XMLAttribute *attr = node->FirstAttribute();attr; attr = attr->Next())
    //     {

    //         attributes->Set(
    //             String::NewFromUtf8(isolate,attr->Name()),
    //             String::NewFromUtf8(isolate,attr->Value())
    //         );
    //     }
    //     obj->Set(String::NewFromUtf8(isolate,"attrs"),attributes);

    //     obj->Set(String::NewFromUtf8(isolate,"name"),String::NewFromUtf8(isolate,node->Name()));

    //     if(node->GetText()){
    //         obj->Set(String::NewFromUtf8(isolate,"value"),String::NewFromUtf8(isolate,node->GetText()));
    //     }

    //     Local<Array> children = Array::New(isolate);

    //     int i = 0;
    //     for(const XMLElement *child = node->FirstChildElement();child;child=child->NextSiblingElement()){
    //         Local<Object> cObj = Object::New(isolate);
    //         ToObject2(child,cObj,isolate);
    //         children->Set(i,cObj);
    //         i++;
    //     }
        
    //     obj->Set(String::NewFromUtf8(isolate,"children"),children);
    // }

    void ToObject3(pugi::xml_node node,Local<Object> & obj,Isolate* isolate){
        Local<Object> attributes = Object::New(isolate);
            

        for(pugi::xml_attribute attr : node.attributes()){
            attributes->Set(
                String::NewFromUtf8(isolate,attr.name()),
                String::NewFromUtf8(isolate,attr.value())
            );
        }

        obj->Set(String::NewFromUtf8(isolate,"attrs"),attributes);

        obj->Set(String::NewFromUtf8(isolate,"name"),String::NewFromUtf8(isolate,node.name()));

        obj->Set(String::NewFromUtf8(isolate,"value"),String::NewFromUtf8(isolate,node.value()));
        

        Local<Array> children = Array::New(isolate);

        int i = 0;

        for(pugi::xml_node child : node.children()){
            Local<Object> cObj = Object::New(isolate);
            ToObject3(child,cObj,isolate);
            children->Set(i,cObj);
            i++;
        }
        
        obj->Set(String::NewFromUtf8(isolate,"children"),children);
    }

    void Method(const FunctionCallbackInfo<Value>&args){
        Isolate* isolate = args.GetIsolate();
        Local<Context> context = isolate->GetCurrentContext();

        Local<Object> obj = Object::New(isolate);

        if(!args[0]->IsString()){
            args.GetReturnValue().Set(obj);
            return;
        }

        
        Local<String> str = args[0].As<String>();


        try{
            String::Utf8Value value(str);

            // xml_document<> doc;    // character type defaults to char
            // doc.parse<0>(*value); 
            // xml_node<> *node = doc.first_node();
            // ToObject(node,obj,isolate,context);

            // XMLDocument doc ;
            // doc.Parse(*value);

            // ToObject2(doc.FirstChildElement(),obj,isolate);

            pugi::xml_document doc;

            doc.load_string(*value,pugi::parse_ws_pcdata);

            ToObject3(doc.first_child(),obj,isolate);


        }
        catch (const std::runtime_error& e)
        {
            std::cerr << "Runtime error was: " << e.what() << std::endl;
        }
        // catch (const rapidxml::parse_error& e)
        // {
        //     std::cerr << "Parse error was: " << e.what() << std::endl;
        // }
        catch (const std::exception& e)
        {
            std::cerr << "Error was: " << e.what() << std::endl;
        }
        catch (...)
        {
            std::cerr << "An unknown error occurred." << std::endl;
        }
       
        args.GetReturnValue().Set(obj);


    }

    void Initialize(Local<Object> exports){
        NODE_SET_METHOD(exports,"parseString",Method);
    }

    NODE_MODULE(NODE_GYP_MODULE_NAME,Initialize);
}