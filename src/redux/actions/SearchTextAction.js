import{
    SEARCH_TEXT
}from './Types';


export const setSearchText=(searchText)=>({
  type:SEARCH_TEXT,
  payload:searchText
});
