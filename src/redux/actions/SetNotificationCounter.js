import{
    NOTIFICATION_COUNTER
}from './Types';


export const setNotificationCounter=(value)=>({
  type:NOTIFICATION_COUNTER,
  payload:value
});
