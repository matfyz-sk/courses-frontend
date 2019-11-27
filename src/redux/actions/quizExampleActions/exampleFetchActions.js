import {SET_EXAMPLE_DATA} from '../../types';


export const getData = () => {
   return (dispatch) => {
     fetch('URL').then((data)=>{
       dispatch({ type: SET_EXAMPLE_DATA, data });
     })
   };
};
