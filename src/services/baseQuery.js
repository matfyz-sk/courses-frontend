import { request, ClientError } from 'graphql-request'

export const graphqlBaseQuery =
  ({ url }) =>
  async ({ document }) => {
    try {
      const result = await request(url, document)
      return { data: result }
    } catch (error) {
      if (error instanceof ClientError) {
        return { error: { status: error.response.status, message: error } }
      }
      return { error: { status: 500, data: error } }
    }
  }

export const getStringEquals = (value) => {
  return `(equals: ["${value}"])`
}

export const getNonStringEquals = (value) => {
  return `(equals: [${value}])`
}

export const getSelectById = (id) => {
  return `(_id: ["${id}"])`
}

export const getOrderBy = () => {
  return `(order: ASC)`
}