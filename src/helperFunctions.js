export const timestampToString = (timestamp) => {
  let date = (new Date(timestamp));
  return date.getHours()+":"+(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()+" "+date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
}

export const randomSentence = () =>{

const subjects=['I','You','Bob','John','Sue','Kate','The lizard people'];
const verbs=['will search for','will get','will find','attained','found','will start interacting with','will accept','accepted'];
const objects=['Billy','an apple','a Triforce','the treasure','a sheet of paper'];
const endings=['.',', right?','.',', like I said.','.',', just like you!'];
	return subjects[Math.round(Math.random()*(subjects.length-1))]+' '+verbs[Math.round(Math.random()*(verbs.length-1))]+' '+objects[Math.round(Math.random()*(objects.length-1))]+endings[Math.round(Math.random()*(endings.length-1))];
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
