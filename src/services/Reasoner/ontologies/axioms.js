import { ONTOLOGY_PREFIX } from "../../../constants/ontology";


// only hasValue axioms, please



export const visualAxioms = `
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@base <http://www.courses.matfyz.sk/axioms#> .


<http://www.courses.matfyz.sk/ontology#Topic>
  a owl:Class ;
  rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty <http://www.courses.matfyz.sk/visual-ontology#isVisualizedBy> ;
    owl:hasValue <http://www.courses.matfyz.sk/visual-ontology#VisualTopic>
  ] .

<http://www.courses.matfyz.sk/ontology#Material>
a owl:Class ;
rdfs:subClassOf [
  a owl:Restriction ;
  owl:onProperty <http://www.courses.matfyz.sk/visual-ontology#isVisualizedBy> ;
  owl:hasValue <http://www.courses.matfyz.sk/visual-ontology#VisualMaterial>
] .

<http://www.courses.matfyz.sk/ontology#Event>
a owl:Class ;
rdfs:subClassOf [
  a owl:Restriction ;
  owl:onProperty <http://www.courses.matfyz.sk/visual-ontology#isVisualizedBy> ;
  owl:hasValue <http://www.courses.matfyz.sk/visual-ontology#VisualEvent>
] .
`;
