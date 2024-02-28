# README #

* ddi-cdi.xsd - XML Schema representation of the model. The names of complex types have the suffix "Type".
  This version is recommended for general XML processing and the generation of documentation.
* ddi-cdi_noXsdTypeInName.xsd - XML Schema representation of the model. The names of complex types have no suffix "Type".
  This version is recommended for any further processing of the XML Schema where the name suffix "Type" can cause trouble.
  Major examples are XML data binding generators which generate program libraries.
