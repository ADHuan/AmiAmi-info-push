import PushNotification, {Importance} from 'react-native-push-notification';
PushNotification.createChannel(
  {
    channelId: 'amiamipush1', // (required)
    channelName: 'AmiAmi Info Push Channel 1', // (required)
    channelDescription: 'AmiAmi补货信息通知频道', // (optional) default: undefined.
    playSound: false, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);
export const PushSrv = (item: any) => {
  if (item.canbuy=='true') {
    PushNotification.localNotification({
      channelId: 'amiamipush1',
      message: item.gname + '补货啦！',
    });
  } else if(item.canbuy=='false'){
    PushNotification.localNotification({
      channelId: 'amiamipush1',
      message: item.gname + '又没货啦！',
    });
  }else {
    PushNotification.localNotification({
      channelId: 'amiamipush1',
      message: item.gname + '链接失效！',
    });
  }
};
