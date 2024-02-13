import messaging from '@react-native-firebase/messaging';
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        getfcmToken()
    }
}

const getfcmToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken')
    console.log(fcmToken, 'the old token')
    if (!fcmToken) {
        try {
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
                console.log(fcmToken, 'new')
                await AsyncStorage.setItem('fcmToken', fcmToken)
            }
        } catch (error) {
            console.log(error, 'errorNotification')
        }
    }
}

export const notificationListner = async () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
    });


    messaging()
        .getInitialNotification()
        .then(async (remoteMessage) => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
            }
        })

    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
    });
}


export const schedulePushNotification = async (title, body, type, data) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: {
                type,
                data,
            },
        },
        trigger: null,
    });
}

export const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        // console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}
