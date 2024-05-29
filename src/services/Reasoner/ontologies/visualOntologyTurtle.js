export const visualOntologyTurtle = `
@prefix : <http://www.courses.matfyz.sk/visual-ontology#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix xml: <http://www.w3.org/XML/1998/namespace> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix visual-ontology: <http://www.courses.matfyz.sk/visual-ontology#> .
@base <http://www.courses.matfyz.sk/visual-ontology#> .

<http://www.courses.matfyz.sk/visual-ontology#> rdf:type owl:Ontology .

#################################################################
#    Object Properties
#################################################################

###  http://www.courses.matfyz.sk/visual-ontology#hasIcon
visual-ontology:hasIcon rdf:type owl:ObjectProperty ;
                        rdfs:subPropertyOf owl:topObjectProperty ;
                        rdf:type owl:FunctionalProperty ;
                        rdfs:domain visual-ontology:VisualGraphNode ;
                        rdfs:range visual-ontology:Icon .


###  http://www.courses.matfyz.sk/visual-ontology#hasPrimaryColor
visual-ontology:hasPrimaryColor rdf:type owl:ObjectProperty ;
                                rdfs:subPropertyOf owl:topObjectProperty ;
                                rdf:type owl:FunctionalProperty ;
                                rdfs:domain visual-ontology:VisualGraphNode ;
                                rdfs:range visual-ontology:Color .


###  http://www.courses.matfyz.sk/visual-ontology#hasSecondaryColor
visual-ontology:hasSecondaryColor rdf:type owl:ObjectProperty ,
                                           owl:FunctionalProperty ;
                                  rdfs:domain visual-ontology:VisualGraphNode ;
                                  rdfs:range visual-ontology:Color .


###  http://www.courses.matfyz.sk/visual-ontology#hasShape
visual-ontology:hasShape rdf:type owl:ObjectProperty ;
                         rdfs:subPropertyOf owl:topObjectProperty ;
                         rdf:type owl:FunctionalProperty ;
                         rdfs:domain visual-ontology:VisualGraphNode ;
                         rdfs:range visual-ontology:Shape .


#################################################################
#    Data properties
#################################################################

###  http://www.courses.matfyz.sk/visual-ontology#description
visual-ontology:description rdf:type owl:DatatypeProperty ;
                            rdfs:domain visual-ontology:VisualGraphNode ;
                            rdfs:range rdf:langString .


###  http://www.courses.matfyz.sk/visual-ontology#name
visual-ontology:name rdf:type owl:DatatypeProperty ;
                     rdfs:domain visual-ontology:VisualGraphNode ;
                     rdfs:range rdf:langString .


#################################################################
#    Classes
#################################################################

###  http://www.courses.matfyz.sk/visual-ontology#Color
visual-ontology:Color rdf:type owl:Class .


###  http://www.courses.matfyz.sk/visual-ontology#Icon
visual-ontology:Icon rdf:type owl:Class .


###  http://www.courses.matfyz.sk/visual-ontology#Shape
visual-ontology:Shape rdf:type owl:Class .


###  http://www.courses.matfyz.sk/visual-ontology#VisualGraphNode
visual-ontology:VisualGraphNode rdf:type owl:Class .


#################################################################
#    Individuals
#################################################################

###  http://www.courses.matfyz.sk/visual-ontology#Calculus
visual-ontology:Calculus rdf:type owl:NamedIndividual .


###  http://www.courses.matfyz.sk/visual-ontology#Calendar
visual-ontology:Calendar rdf:type owl:NamedIndividual ,
                                  visual-ontology:Icon .


###  http://www.courses.matfyz.sk/visual-ontology#Document
visual-ontology:Document rdf:type owl:NamedIndividual ,
                                  visual-ontology:Icon .


###  http://www.courses.matfyz.sk/visual-ontology#Palegreen
visual-ontology:Palegreen rdf:type owl:NamedIndividual ,
                               visual-ontology:Color .


###  http://www.courses.matfyz.sk/visual-ontology#Oval
visual-ontology:Oval rdf:type owl:NamedIndividual ,
                              visual-ontology:Shape .


###  http://www.courses.matfyz.sk/visual-ontology#Rectangle
visual-ontology:Rectangle rdf:type owl:NamedIndividual ,
                                   visual-ontology:Shape .


###  http://www.courses.matfyz.sk/visual-ontology#VisualEvent
visual-ontology:VisualEvent rdf:type owl:NamedIndividual ,
                                     visual-ontology:VisualGraphNode ;
                            visual-ontology:hasIcon visual-ontology:Calendar ;
                            visual-ontology:hasPrimaryColor visual-ontology:White ;
                            visual-ontology:hasShape visual-ontology:Rectangle .


###  http://www.courses.matfyz.sk/visual-ontology#VisualMaterial
visual-ontology:VisualMaterial rdf:type owl:NamedIndividual ,
                                        visual-ontology:VisualGraphNode ;
                               visual-ontology:hasIcon visual-ontology:Document ;
                               visual-ontology:hasPrimaryColor visual-ontology:White ;
                               visual-ontology:hasShape visual-ontology:Rectangle .


###  http://www.courses.matfyz.sk/visual-ontology#VisualTopic
visual-ontology:VisualTopic rdf:type owl:NamedIndividual ,
                                     visual-ontology:VisualGraphNode ;
                            visual-ontology:hasPrimaryColor visual-ontology:Lightyellow ;
                            visual-ontology:hasSecondaryColor visual-ontology:Palegreen ;
                            visual-ontology:hasShape visual-ontology:Oval .


###  http://www.courses.matfyz.sk/visual-ontology#White
visual-ontology:White rdf:type owl:NamedIndividual ,
                               visual-ontology:Color .


###  http://www.courses.matfyz.sk/visual-ontology#Lightyellow
visual-ontology:Lightyellow rdf:type owl:NamedIndividual ,
                                visual-ontology:Color .


###  Generated by the OWL API (version 4.5.26.2023-07-17T20:34:13Z) https://github.com/owlcs/owlapi

`;

