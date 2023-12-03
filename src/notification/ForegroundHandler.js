import { useEffect } from "react";
import messaging from '@react-native-firebase/messaging';
import { schedulePushNotification } from "./notifications";
const ForegroundHandler = (params) => {
    useEffect(() => {
        const unsubscribe =  messaging().onMessage(async remoteMessage => {
           console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
            const { title, body } = remoteMessage.notification;
            const { type, data } = remoteMessage.data;
            schedulePushNotification(title, body, type, data);
        })
        return unsubscribe
    }, [])
 
    return null

};
export default ForegroundHandler