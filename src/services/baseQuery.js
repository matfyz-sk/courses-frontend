import { request, ClientError, rawRequest } from 'graphql-request'
import {
  capitalizeFirstLetter,
  decapitalizeFirstLetter,
} from '../helperFunctions'
import { ONTOLOGY_PREFIX } from '../constants/ontology'

export const graphqlBaseQuery =
  ({ url }) =>
  async ({ document, variables }) => {
    try {
      const result = await request(url, document, variables)
      return { data: result }
    } catch (error) {
      if (error instanceof ClientError) {
        return { error: { status: error.response.status, message: error } }
      }
      return { error: { status: 500, data: error } }
    }
  }

export const getStringEquals = value => {
  return `(equals: ["${value}"])`
}

export const getNonStringEquals = value => {
  return `(equals: [${value}])`
}

export const getSelectById = id => {
  return `(_id: ["${id}"])`
}

export const getOrderBy = () => {
  return `(order: ASC)`
}

export const getArrayFormat = array => {
  return JSON.stringify(array)
}
