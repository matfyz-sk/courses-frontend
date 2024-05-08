import * as rdf from 'rdflib';
import {fromNT, isBlankNode, isLiteral, isNamedNode, Namespace} from 'rdflib';

import {getShortType} from "../../helperFunctions.js"

const RDF = Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const RDFS = Namespace("http://www.w3.org/2000/01/rdf-schema#");
const FOAF = Namespace("http://xmlns.com/foaf/0.1/");
const XSD = Namespace("http://www.w3.org/2001/XMLSchema#");
const OWL = Namespace("http://www.w3.org/2002/07/owl#");

class Ontology {

  constructor(body, uri, mimeType) {
    this.body = body;
    this.uri = uri;
    this.mimeType = mimeType

    this.store = this.parse()
  }

  parse() {
    try {
      const store = rdf.graph();
      rdf.parse(this.body, store, this.uri, this.mimeType)
      return store

    } catch (err) {
      console.log('parsing error ' + err)
    }
  }

  isClass(className) {
    return this.store.statementsMatching(className, RDF('type'), RDFS('Class')) !== null
      || this.store.statementsMatching(className, RDF('type'), OWL('Class')) !== null
  }

  getAllSubclassesOf(className) {
    if (!this.isClass(className)) {
      console.log(className + ' is not a class')
    }

    return Object.keys(
      this.store.findSubClassesNT(
        rdf.sym(className)))
      .map((uri) => {
        return fromNT(uri).value}
      )

    // let openedClasses = [className]
    // let subclasses = []
    // while (openedClasses.length !== 0) {
    //   let subclass = openedClasses.pop()
    //   subclasses.push(subclass.value)
    //   let newSubclasses = this.store.each(null, RDFS('subClassOf'), subclass)
    //   openedClasses.push(...newSubclasses)
    // }
    //
    // return subclasses
  }

  getClasses() {
    let classes = this.store.each(undefined, RDF('type'), RDFS('Class'))
    classes.push(...this.store.each(undefined, RDF('type'), OWL('Class')))
    return classes.map((node => {
        return node.value
      }))
  }

  getRestrictions() {
    let restrictions = this.store.each(undefined, RDF('type'), OWL('Restriction'))
    restrictions = restrictions.map((restriction) => {
      let onProperty = this.store.any(restriction, OWL('onProperty'), null).value;
      let hasValue = this.store.any(restriction, OWL('hasValue'), null);
      let restrictedClass = this.store.any(undefined, RDFS('subClassOf'), restriction).value;

      return {onProperty, hasValue, restrictedClass}
    })

    return restrictions
  }

  getIndividual(node) {
    if (!Ontology.isNode(node)) {
      return {}
    }

    let allProperties = this.store.statementsMatching(rdf.sym(node.value), null, null)
    return allProperties.reduce((acc, statement) => {
      let propertyName = getShortType(statement.predicate.value);
      acc[propertyName] = getShortType(statement.object.value);
      return acc;
    }, {})
  }

  static isLiteral(value) {
    return isLiteral(value)
  }

  static isNode(value) {
    return isBlankNode(value) || isNamedNode(value)
  }
}

export default Ontology;
