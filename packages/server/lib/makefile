test: test.o tinyxml2.o pugixml.o
	g++ -std=c++11 -o test $^

test.o:test.cc rapidxml-1.13/rapidxml.hpp
	g++ -std=c++11 -c test.cc -o $@

tinyxml2.o:./tinyxml2/tinyxml2.cpp
	g++ -std=c++11 -c $^ -o $@

pugixml.o:./pugixml-1.10/src/pugixml.cpp
	g++ -std=c++11 -c $^ -o $@