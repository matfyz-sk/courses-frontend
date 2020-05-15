import axios from 'axios'
import { getToken } from './components/Auth';
import { API_URL as REST_URL } from './configuration/api';
import moment from 'moment';
export const randomSentence = () =>{

const subjects=['I','You','Bob','John','Sue','Kate','The lizard people'];
const verbs=['will search for','will get','will find','attained','found','will start interacting with','will accept','accepted'];
const objects=['Billy','an apple','a Triforce','the treasure','a sheet of paper'];
const endings=['.',', right?','.',', like I said.','.',', just like you!'];
	return subjects[Math.round(Math.random()*(subjects.length-1))]+' '+verbs[Math.round(Math.random()*(verbs.length-1))]+' '+objects[Math.round(Math.random()*(objects.length-1))]+endings[Math.round(Math.random()*(endings.length-1))];
}

//time manipulation
export const timestampToInput = (timestamp)=>{
  return timestamp!==null && timestamp!=='' && timestamp!==undefined ?new Date(timestamp).toISOString().replace('Z',''):''
}

export const inputToTimestamp = (input)=>{
  return isNaN(new Date(input).getTime()) || input === '' ? null : (new Date(input).getTime())
}

export const timestampToString = (timestamp) => {
  let date = (new Date(timestamp));
  return date.getHours()+":"+(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()+" "+date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
}

export const afterNow = (date) => {
	return inputToTimestamp(date) !== null && inputToTimestamp(date) > (new Date()).getTime()
}

export const addMinutesToDate = ( date, minutes ) =>{
	return moment(date).add(minutes, 'm').toDate()
}

//supported languages at https://github.com/conorhastings/react-syntax-highlighter/blob/HEAD/AVAILABLE_LANGUAGES_HLJS.MD
export const getFileType = (extension) =>{
  switch (extension) {
    case 'js':{
      return 'jsx';
    }
    case 'scss':{
      return 'scss';
    }
    default:{
      return 'text';
    }

  }
}

export const htmlFixNewLines = (text) => {
  return text.replace(/(?:\r\n|\r|\n)/g,'<br>');
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
	afterNow(addMinutesToDate(new Date(period.deadline), period.extraTime).getTime())
}

export const periodHasEnded = (period) => {
	return !afterNow(period.openTime) &&
	!afterNow(addMinutesToDate(new Date(period.deadline), period.extraTime).getTime())
}

export const getStudentName = (student) => student.firstName + ' ' + student.lastName;
