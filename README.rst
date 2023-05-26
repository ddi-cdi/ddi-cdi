DDI-CDI Specification
*********************

The DDI-Cross Domain Integration (DDI-CDI) specification provides a
model for working with a wide variety of research data across many
scientific and policy domains. It provides a level of detail which
supports machine-actionable processing of data, both within and between
systems, and is designed to be easily aligned with other standards.

It focuses on the key elements of the data management challenges facing
research today: an exact understanding of data in a wide variety of
formats, coming from many different sources. Two elements are critical
for dealing with these challenges: a flexible means of describing data
that can reveal the connections between the same data existing in
different formats, and a means of describing the provenance of the data
at a detailed (but comprehensible) level: the processes which produced
it must be transparent.

DDI-CDI covers these areas in a fashion intended to make it optimally
useful to modern systems, which often employ a variety of models, and
comply with a range of related specifications for both functions related
to data description and process/provenance. The model is designed to be
easy to fit into such systems, by aligning with relevant external
standards, and to be align-able with them into the future.

**
For the impatient:

 - The model in syntax representations/encodings, the high-level and field-level
   documentation are available in the folder build.
 - The core model field-level documentation is available in the section
   DDICDIModels::DDICDILibrary.
 - Examples are available in the folder source/example.
**

Further information on DDI-CDI is available at the
related DDI Alliance web page https://ddialliance.org/Specification/DDI-CDI/.

Purpose
-------

The DDI-CDI specification describes a model and supporting elements for
implementing it in the areas of data description and process/provenance.
It is not intended to supplant existing specifications for these
purposes, but to fill in the information which such specifications often
do not capture. For data, this is the description of a single bit of
information – a datum – which can be used to play different roles in
different data structures and formats. For provenance and process, this
is the packaging of specific machine-level processes, which may be
described in many different ways, into a structure which relates them to
the business processes described at a level understandable to human
users.

In order to serve this purpose, the DDI-CDI specification uses a Unified
Modeling Language (UML) formalization so that it can be mapped against
other models within systems more easily. Several different syntax
expressions of the model are made available to support implementation.

Several important features of the specification can be highlighted, to
show how it serves this purpose:

-  Domain-independence

-  Datum-Oriented Data Description

-  Provenance and Process Description

-  Foundational Metadata

-  Interoperability, Sustainability, and Alignment with Other Standards

Each of these will be addressed in more detail, and an outline of the
specification documents is presented.

Key Features of the Specification
---------------------------------

**Domain Independence**

DDI-CDI is designed to be used with research data from any domain. In
order to do this, it is fundamentally based on the structure and other
generic aspects of the things it describes. It does not attempt to be a
domain model of semantics, nor a model specific to the life-cycle of a
particular domain of science or research. (Historically, DDI has focused
on the Social, behavioral, and Economic [SBE] sciences and some types of
health research – to see how DDI-CDI relates to other DDI
specifications, see below.)

DDI-CDI is intended to be complimentary to (and used in combination
with) other standards and models which focus more on domain-specific
aspects (such as semantics and life-cycle models). Such generic elements
such as classifications and variables are given a detailed formal
treatment but are agnostic as to the domain. It is left to the user to
employ whatever domain semantics are demanded by the data with which
they are working.

This feature of the specification makes it well-suited to combining data
coming from more than one domain or system, to allow a description that
supports systems which perform data integration, harmonization, and
similar functions. Cross-domain data sharing is becoming increasingly
common, and DDI-CDI is intended to provide support for this type of
application.

**Datum-Oriented Data Description**

DDI-CDI embraces a form of data description which is based on its atomic
components: individual datums. Any given datum can play different roles
in different formatting of the same data set, depending on how it is
processed and transformed. In order to retain the continuity of a given
datum across different formats and throughout a series of processes,
DDI-CDI allows it to be described playing different roles in different
structures.

DDI-CDI provides four basic types of structural description for data
sets: wide data, long data, dimensional data, and key-value data. These
four types (and their sub-types) provide coverage for many common data
formats today. While not comprehensive, they cover the majority of cases
that the developers of this specification have seen. These include many
of the newer forms of data such as streaming data, "big" data,
registers, and instrument data. The underlying approach is one which
could – and may be – expanded in future. By assigning appropriate roles
to the variables which contain the datums across each of these different
formats, however, it is possible to understand how data passes from one
form to another.

**Provenance and Process Description**

If we are to fully understand data, we also need to know how it has been
processed and transformed. Given our ability to describe how a different
datum can be used in different data sets, it becomes desirable to
understand also how those data sets relate to one another in terms of
the processes which use them. This can be understood as an important
aspect of data provenance.

There are many different ways of describing process and provenance.
Popular models include the Business Process Modelling and Notation
(BPMN) standard and the PROV Ontology (from W3C). There are a multitude
of syntaxes for driving data transformation, cleaning, and analysis in
packages such as R, SAS, Stata, MATLab, SPSS, Python, and so on. There
are also some emerging standard models for specifically describing such
processes (e.g., Structured Data Transformation Language
[SDTL], https://ddialliance.org/products/sdtl/1.0, Validation and
Transformation Language [VTL], https://sdmx.org/?page_id=5096).

DDI-CDI attempts to do something which complements the use of such
models, by connecting specific processes interpretable by machines at
the lowest level (described in a package-specific syntax or language)
with the higher-level flows which combine these into human-readable
documentation of business processes. Both traditional linear
(deterministic) processing and the newer declarative (non-deterministic)
processing approaches are supported.

**Foundational Metadata**

In order to formally describe data at a detailed level, there are many
component elements which themselves must be modelled. Concepts used for
statistical data but also widely applicable – including categories and
variables – are a core part of this, but the range is broad. These
components are included in DDI-CDI as "foundational metadata."

Terminology for such constructs varies widely across domains. DDI-CDI
has attempted to provide common terms for these components, and to adopt
common models from other standards where it seemed useful.

One area which deserves particular attention is the "variable cascade" –
a model for how data are described at different points in their
creation, processing, and use, which is designed to optimize reuse.
While many different models have a "variable" of some form, the one
presented in DDI-CDI reflects the experience of working with this
important construct in many of the specifications and standards which
have preceded it. It is a nuanced view of how variables relate and are
understood across different systems, and – although not simple – it is a
powerful model which helps solve some of the commonly encountered
problems in data description and management.

**Interoperability, Sustainability, and Alignment with Other Standards**

DDI-CDI is fundamentally a model which is intended to be implemented
across a wide variety of technology platforms, and in combination with
many other standards, models, and specifications. To support this use,
it is formalized using a limited subset of the Unified Modelling
Language (UML) class diagram part. The model is provided in the form of
Canonical XMI (restricted XML Metadata Interchange) – an interchange
format for UML models supporting the import into many different
modelling and development tools. Further, a syntax representation is
provided in XML Schema, so that direct implementation of the model is
possible if needed.

The platform-independence of the model makes it more easily applicable
across a broad range of applications and helps ensure that it will be
sustainable even as the technology landscape evolves.

DDI-CDI builds on many other standard models and is aligned with them
where appropriate. This is shown in the model itself, where
formalizations from other models and specifications are refined,
extended, or directly used. The specification includes a description of
what these other standards and models are, and how they are used in DDI-CDI.

Credits
-------

Members of the Cross Domain Integration (CDI) Working Group shepherded the standard into its final form and produced the final documentation. Listed in alphabetical order they are: 

-  Arofan Gregory (chair)
-  Dan Gillman
-  Flavio Rizzolo
-  Hilde Orten
-  Jay Greenfield
-  Joachim Wackerow
-  Larry Hoyle
-  Oliver Hopt
-  Wendy Lee Thomas (Technical Committee contact)

Over 100 people have contributed to the development of the Data Documentation Initiative Cross Domain Integration (DDI-CDI) specification. A more complete description of their contribution to the work can be found at https://bitbucket.org/ddi-alliance/ddi-cdi/src/master/CREDITS.md.

-----

.. toctree::
   :hidden:

   Context/index.rst
   DDICDILibrary/index.rst
   DesignPatterns/index.rst
   Appendices/index.rst
   about/index.rst
