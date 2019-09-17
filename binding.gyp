{
    "targets":[
        {
            "target_name": "rapidxml",
            "sources": [ "lib/xml.cc","lib/pugixml-1.10/src/pugixml.cpp" ],
            'cflags_cc!': [ '-fno-exceptions' ],
            "cflags!" : [
                "-fno-exceptions"
            ],
            'conditions': [
                ['OS=="mac"', {
                'xcode_settings': {
                    'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
                }
                }]
            ],
        }
    ]
}