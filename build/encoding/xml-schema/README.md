# README #

* ddi-cdi.xsd - XML Schema representation of the model. The names of complex types have the suffix "Type".
* ddi-cdi_noXsdTypeInName.xsd - XML Schema representation of the model. The names of complex types have no suffix "Type".
  This version is recommended for any further processing of the XML Schema where the name suffix "Type" can cause trouble.
  A major example are XML data binding generators which generated program libraries.
