import firebase from 'react-native-firebase';
// Optional flow type
import type { RemoteMessage, NotificationOpen } from 'react-native-firebase';
import {
  Platform,AppState, AsyncStorage
} from 'react-native';
//
import DefaultPreference from 'react-native-default-preference';
//import {AsyncStorage} from 'react-native';
//
export default async (message: RemoteMessage) => {
    const currentAppState = AppState.currentState;
    console.log('fromBG Message '+JSON.stringify(message.data));
    // listen for app state change, then save the message data using AsyncStorage
    AppState.addEventListener("change", nextAppstate => {
        if(currentAppState === "active" && nextAppState === "uninitialized") {
            // I named the item key `FCM.BG_MESSAGE` but you can name it what you want.
            // Then, serialise the data to JSON, because AsyncStorage only allow strings as value
            AsyncStorage.setItem("FCM.BG_MESSAGE", JSON.stringify(message.data));
            //alert('test click data')
        }
    });
    //

    // const valueNotificationCounter =  AsyncStorage.getItem('notificationCounter');
    // console.log("Counter value is  "+JSON.stringify(valueNotificationCounter));
    // AsyncStorage.setItem('notificationCounter', 1);
    // DefaultPreference.get('notificationCounter').then(function(value) {
    //       if(value!==null && value!=undefined){
    //
    //         notficationCounter = 3
    //       }else{
    //         console.log("Counter is zero");
    //         notficationCounter = 1
    //       }
    //       //
    //       console.log("notficationCounter "+notficationCounter);
    //       // //
    //       AsyncStorage.setItem('notificationCounter', notficationCounter);
    //       // new Promise((resolve) =>
    //       //       DefaultPreference.set('notificationCounter', notficationCounter.toString())
    //       // )
    //       // //
    // });
    //
    // handle your message



    if(Platform.OS == "android") {
        //
        const channelId = new firebase.notifications.Android.Channel("nyotaApp", "nyotaApp", firebase.notifications.Android.Importance.High);
        firebase.notifications().android.createChannel(channelId);
        //
        const notification_to_be_displayed = new  firebase.notifications.Notification({
                                                    data: "",
                                                    sound: 'default',
                                                    show_in_foreground: true,
                                                    title: message.data.title,
                                                    body: message.data.body,
                                                });
        notification_to_be_displayed
        .android.setPriority(firebase.notifications.Android.Priority.High)
        .android.setAutoCancel(true)
        .android.setChannelId("nyotaApp")
        .android.setVibrate(1000);
        //
        firebase.notifications().displayNotification(notification_to_be_displayed);
        //
    }else if (Platform.OS === 'ios') {
        //
        const localNotification = new firebase.notifications.Notification({sound: 'default',
                                                                           show_in_foreground: true})
          .setNotificationId(notification.notificationId)
          .setTitle(message.data.title)
          .setSubtitle('notification.subtitle')
          .setBody(message.data.body)
          .setData('notification.data')
          .ios.setBadge(notification.ios.badge);
        //
        firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));
      }
    //
    DefaultPreference.get('notificationCounter').then(function(value) {
        //
        if(value!==undefined && value!==null){
          new Promise(function(resolve, reject) {
              resolve(Number(value));
          }).then(value => {
            DefaultPreference.set('notificationCounter',(value+1).toString())
          });
        }else{
          const prom = new Promise(function(resolve, reject) {
              resolve(1);
          }).then(value => {
            DefaultPreference.set('notificationCounter',value.toString())
          });
        }
        //
    });
    //
    return Promise.resolve();
}

//https://github.com/invertase/react-native-firebase/issues/1518
// // @flow
// import firebase from 'react-native-firebase';
// // Optional flow type
// import type { RemoteMessage } from 'react-native-firebase';
// import type { Notification,NotificationOpen} from 'react-native-firebase';
// //
// import {
//   Platform
// } from 'react-native';
// //
// export default async (message: RemoteMessage) => {
// this.notificationListener = firebase.notifications().onNotification((notification) => {
//   if (Platform.OS === 'android') {
//     //alert('recevied '+JSON.stringify(notification.title)+' '+JSON.stringify(notification.subtitle)+' '+JSON.stringify(notification.body))
//     const localNotification = new firebase.notifications.Notification({
//         sound: 'default',
//         show_in_background: true,
//       })
//       .setNotificationId(notification.notificationId)
//       .setTitle("notification.title")
//       .setSubtitle("notification.subtitle")
//       .setBody("notification.body")
//       .android.setChannelId('nyotaApp') // e.g. the id you chose above
//       .android.setColor('#ffffff') // you can set a color here
//       .android.setPriority(firebase.notifications.Android.Priority.High);
//
//     firebase.notifications()
//       .displayNotification(localNotification)
//       .catch(err => console.error(err));
//
//   } else if (Platform.OS === 'ios') {
//
//     const localNotification = new firebase.notifications.Notification()
//       .setNotificationId(notification.notificationId)
//       .setTitle(notification.title)
//       .setSubtitle(notification.subtitle)
//       .setBody(notification.body)
//       .setData(notification.data)
//       .ios.setBadge(notification.ios.badge);
//
//     firebase.notifications()
//       .displayNotification(localNotification)
//       .catch(err => console.error(err));
//
//   }
// });
// // const notification = new firebase.notifications.Notification()
// //                   .setNotificationId(notification.notificationId)
// //                   .setTitle("message.data.show_name")
// //                   .setBody("message.data.description")
// //                   .android.setChannelId('nyotaApp')
// //                   .android.setAutoCancel(true)
// //                   .android.setPriority(firebase.notifications.Android.Priority.High);
// // // const channelId = new firebase.notifications.Android.Channel("nyotaApp", "nyotaApp", firebase.notifications.Android.Importance.Max);
// // // // Create the channel
// // // firebase.notifications().android.createChannel(channelId);
// // onst channel = new firebase.notifications.Android.Channel('nyotaApp', 'nyotaApp', firebase.notifications.Android.Importance.Max)
// //   .setDescription('My apps test channel');
// //
// // // Create the channel
// // firebase.notifications().android.createChannel(channel);
// // firebase.notifications().displayNotification(notification).catch(err => alert("Error in Background"));
// //
// return Promise.resolve();
// }
