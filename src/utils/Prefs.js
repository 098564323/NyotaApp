import DefaultPreference from 'react-native-default-preference';

export const USER_TOKEN = 'user_token';

export const getPrfsData=(prfsKey)=>{
    DefaultPreference.get(prfsKey)
      .then(function(value) {
        return value;
      });
}

export const setPrefsData=(prfsKey,value)=>{
    DefaultPreference.set(prfsKey, value)
    .then(function() {
      console.log('done')
    });
}
