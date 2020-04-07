import {SET_EXAMPLE_DATA} from '../../types';


export const getData2 = () => {
   return (dispatch) => {
     fetch('URL').then((data)=>{
       dispatch({ type: SET_EXAMPLE_DATA, data });
     })
   };
};
