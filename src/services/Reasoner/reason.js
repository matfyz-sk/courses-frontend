import React from 'react'

import {getShortType} from "../../helperFunctions.js"

import {visualOntologyTurtle} from "./ontologies/visualOntologyTurtle";
import {coursesOntologyTurtle} from "./ontologies/coursesOntologyTurtle";
import {visualAxioms} from "./ontologies/axioms";

import { ONTOLOGY_PREFIX, VISUAL_ONTOLOGY_PREFIX } from "../../constants/ontology";
import Ontology from "./Ontology";


export function reason(data, axioms= visualAxioms, secondaryOnt= visualOntologyTurtle, secondaryOntPrefix = VISUAL_ONTOLOGY_PREFIX) {
  let coursesOntology = new Ontology(coursesOntologyTurtle, ONTOLOGY_PREFIX, 'text/turtle')
  let secondaryOntology = new Ontology(secondaryOnt, secondaryOntPrefix, 'text/turtle')
  let axiomsOntology = new Ontology(axioms, 'http://www.courses.matfyz.sk/axioms#', 'text/turtle')

  let restrictions = axiomsOntology.getRestrictions()

  return data?.map((dataRow) => {
    let type = dataRow._type
    let newDataRow = {...dataRow}

    restrictions.forEach((restriction) => {
      let restrictedClass = restriction.restrictedClass
      if (coursesOntology.getAllSubclassesOf(restrictedClass).includes(type)) {
        let newValue = restriction['hasValue']
        let onProperty = getShortType(restriction.onProperty)

        if (Ontology.isLiteral(newValue)) {
        }

        else if (Ontology.isNode(newValue)) {
          newValue = secondaryOntology.getIndividual(newValue)
        }

        newDataRow[onProperty] = newValue
      }
    })

    return newDataRow
  }) ?? []
}
