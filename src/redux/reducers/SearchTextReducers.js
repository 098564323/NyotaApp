import{
  SEARCH_TEXT
} from '../actions/Types';



const initialState={
  searchText:'default'
}

export default(state=initialState,action)=>{
  switch (action.type) {
    case SEARCH_TEXT:
      return {...state,
              searchText:action.payload,
      };

    default:
      return state;
  }
}
