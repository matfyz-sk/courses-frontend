import axios from 'axios'
import { getToken } from '../../../components/Auth'

export const axiosRequest = (method, data, url) => {
  return axios
    .request({
      url,
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: getToken() ? `Bearer ${ getToken() }` : '',
      },
      data,
    })
    .then(response => {
      return response
    })
    .catch(error => console.log(error))
}

export const getData = response => {
  if(response && response.status === 200) {
    const {data} = response
    if(
      data &&
      data['@graph'] &&
      data['@graph'].length &&
      data['@graph'].length > 0
    ) {
      return data['@graph']
    }
  }
  return null
}
