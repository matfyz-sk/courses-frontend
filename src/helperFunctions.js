import axios from 'axios'
import { getToken } from './components/Auth';
import { API_URL as REST_URL } from './configuration/api';
import moment from 'moment';

//time manipulation
export const timestampToInput = (timestamp) => {
  return isNaN(timestamp) ? '' : moment.unix(timestamp).format('YYYY-MM-DDTHH:mm')
}

export const inputToTimestamp = (input) => {
  return isNaN(moment(input).unix()) ? null : (moment(input).unix())
}

export const timestampToString = (timestamp) => {
  return moment.unix(timestamp).format('HH:mm DD.MM.YYYY');
}

export const afterNow = (unix) => {
	return unix > moment().unix()
}

export const addMinutesToUnix = ( unix, minutes ) =>{
	return moment.unix(unix).add(minutes, 'm').unix()
}

//supported languages at https://github.com/conorhastings/react-syntax-highlighter/blob/HEAD/AVAILABLE_LANGUAGES_HLJS.MD
const config = {
  js: 'jsx',
  scss: 'scss',
  bash: 'sh',
  cpp: 'cpp',
  cs: 'cs',
  css: 'css',
  delphi: 'delphi',
  dsconfig: 'dsconfig',
  xlsx: 'excel',
  go: 'go',
  http: 'http',
  java: 'java',
  json: 'json',
  md: 'markdown',
  py: 'python',
  ps: 'powershell',
  sql: 'sql',
  swift: 'swift',
  typescript: 'ts',
  xml: 'xml',
}
export const getFileType = (extension) =>{
  if( Object.keys(config).includes(extension) ){
    return config[extension];
  }
  return "text"
}

export const toSelectInput = ( arr, label = 'name', id = '@id' ) => {
  return arr.map((item)=>{
    return {
      ...item,
      value: item[id],
      label: item[label]
    }
  })
}

// AXIOS helpers
export const axiosRequest = (method, url, data) => {
  return axios
    .request({
      url,
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      data,
    })
    .then(response => {
      return { failed: false, error: null, response }
    })
    .catch(error => {
      return { failed: true, error, response: error.response }
    })
}

export const getResponseBody = (response) => {
  return response.response.data['@graph'];
}

export const getShortID = (fullID) => {
  return fullID.substring(fullID.lastIndexOf('/')+1)
}

export const getIRIFromAddResponse = (response) => {
  return response.response.data.resource.iri;
}

export const axiosAddEntity = ( data, entity  ) => {
  return axiosRequest(
    'post',
    `${REST_URL}/${entity}`,
    data
  )
}

export const axiosUpdateEntity = ( data, entity ) => {
  return axiosRequest(
    'patch',
    `${REST_URL}/${entity}`,
    data
  )
}

export const axiosDeleteEntity = ( entity ) => {
  return axiosRequest(
    'delete',
    `${REST_URL}/${entity}`,
    null
  )
}

export const axiosDeleteEntities = ( entities ) => {
  return entities.forEach((entity) => axiosDeleteEntity(entity))
}

export const axiosGetEntities = (entity) => {
  return axiosRequest(
    'get',
    `${REST_URL}/${entity}`,
    null
  ).then( (response) =>{
  return response;
  })
}

export const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export const periodStarted = (period) => {
	return !afterNow(period.openTime)
}

export const periodHappening = (period) => {
	return !afterNow(period.openTime) &&
	afterNow(addMinutesToUnix(period.deadline, period.extraTime))
}

export const periodHasEnded = (period) => {
	return !afterNow(period.openTime) &&
	!afterNow(addMinutesToUnix(period.deadline, period.extraTime))
}

export const getStudentName = (student) => student.firstName + ' ' + student.lastName;

export const sameStringForms = ( item1, item2 ) => {
  return JSON.stringify(item1)===JSON.stringify(item2)
}


export const htmlFixNewLines = (text) => {
  return text.replace(/(?:\r\n|\r|\n)/g,'<br>');
}

export const htmlRemoveNewLines = (text) => {
  return text.replace(/(?:\r\n|\r|\n)/g,'');
}


export const prepareMultiline = ( text ) => {
  return `""${text}""`
}
