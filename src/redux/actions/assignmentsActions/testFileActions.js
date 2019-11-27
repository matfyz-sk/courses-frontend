import {SET_ASIGNMENTS_TEST_FILE} from '../../types';


export const assignmentsGetTestFile = () => {
   return (dispatch) => {
     fetch('http://localhost:8081').then((data)=>{
       data.blob().then(newData=>{
         console.log('newData');
         console.log(newData);
         dispatch({ type: SET_ASIGNMENTS_TEST_FILE, file:newData });
       })
     })
   };
};
