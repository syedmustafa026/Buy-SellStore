import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Base_Url } from '../api/Api';

export const getFCMToken = async () => {
    let fcmToken = await AsyncStorage.getItem("FCMToken")
    if (!fcmToken) {
        try {
            const fcmToken = await messaging().getToken()
            if (fcmToken) {
                await AsyncStorage.setItem("FCMToken", fcmToken)
            }
        }
        catch (error) {
            console.log("error", error);
        }
    }
    return fcmToken
}
export const getMessage = async (uid, fcmToken) => {
    const check = await AsyncStorage.getItem('status')
    if (check == 'loggedIn') {
        const userId = await AsyncStorage.getItem('uid')
        fetch(`${Base_Url}/store-fcm`, {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, fcm: fcmToken }),
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log("firease data", data);

            })
            .catch(error => {
                console.log(error);
            })
    }
}

export const OnPressNotification = async (navigation, message,) => {
    navigation.navigate("Splash", { screen: 'Inbox' })
    console.log("message", JSON.parse(message.data.data))
}

export const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
}
    

export const NotificationListener = async (navigation) => {
    let fcmToken = await getFCMToken()
    const userId = await AsyncStorage.getItem('uid')

    // background
    messaging().onNotificationOpenedApp(message => {
        OnPressNotification(navigation, message,)
    })
    messaging().setBackgroundMessageHandler(async message => {
        getMessage(userId, fcmToken)
    })
    // Quit State
    messaging()
        .getInitialNotification()
        .then(message => {
            if (message) {
                OnPressNotification(navigation, message,)
            }
        })

}