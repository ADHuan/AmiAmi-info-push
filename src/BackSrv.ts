import BackgroundTimer from 'react-native-background-timer';
import AmiItem from './AmiItem';
import {PushSrv} from './PushSrv';
import storage from './storage';
import BackgroundService from 'react-native-background-actions';
let i = 1;

const sleep = (time: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), time));

//目前使用的方法
export const BackSrv = async (taskDataArguments: any) => {
  console.log(BackgroundService.isRunning());
  for (let i = 0; BackgroundService.isRunning(); i++) {
    storage.getAllDataForKey('AmiItem').then(async items => {
      console.log('后台刷新中');
      const doitems = async () => {
        await Promise.all(
          items.map(async (ele: any) => {
            return new Promise<void>((resolve, reject) => {
              console.log('数据库中数据');

              console.log(ele);
              const tempitem = new AmiItem(ele.url, ele.id);

              tempitem.onGet = async () => {
                console.log('刷新后数据');
                console.log(tempitem);
                console.log('等于测试');
                console.log(ele.canbuy);
                console.log(tempitem.canbuy);
                console.log(ele.canbuy != tempitem.canbuy);
                if (ele.canbuy != tempitem.canbuy) {
                  await storage.remove({key: 'AmiItem', id: tempitem.id});
                  console.log('有变化');
                  PushSrv(ele);

                  await storage.save({
                    key: 'AmiItem',
                    id: tempitem.id,
                    data: tempitem.getinfo(),
                  });
                  resolve();
                } else {
                  tempitem.onGet = () => {
                    console.log('无变化');
                  };
                  resolve(console.log('无变化'));
                }
              };
            });
          }),
        );
      };
      await doitems();
    });
    await sleep(10000);
  }
};

const options = {
  taskName: 'AmiAmiBackWatch',
  taskTitle: 'AmiAmi补货监测',
  taskDesc: 'AmiAmi补货监测开启中！',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
};

export const StartBackSrv = async () => {
  await BackgroundService.start(BackSrv, options);
};

export const StopBackSrv = async () => {
  return new Promise<void>(async (resolve, reject) => {
    await BackgroundService.stop();
    resolve();
  });
};

export const IsBackSrv = () =>{
    if(BackgroundService.isRunning()){
        return true
    }
    else {
        return false
    }
}

export const StartBackTimer = () => {
  BackgroundTimer.runBackgroundTimer(() => {
    storage.getAllDataForKey('AmiItem').then(async items => {
      console.log('后台刷新中');
      const doitems = async () => {
        await Promise.all(
          items.map(async (ele: any) => {
            return new Promise<void>((resolve, reject) => {
              const tempitem = new AmiItem(ele.url, ele.id);
              if (ele.canbuy != tempitem.canbuy) {
                tempitem.onGet = async () => {
                  console.log('ele:');
                  console.log(ele);
                  await storage.remove({key: 'AmiItem', id: tempitem.id});
                  console.log('有变化');
                  PushSrv(ele);

                  await storage.save({
                    key: 'AmiItem',
                    id: tempitem.id,
                    data: tempitem.getinfo(),
                  });
                  resolve();
                };
              } else {
                tempitem.onGet = () => {
                  console.log('ele:');
                  console.log(ele);
                  PushSrv(ele);
                  console.log('无变化');
                  resolve();
                };
              }
            });
          }),
        );
      };
      await doitems();
    });
    //code that will be called every {*} seconds
  }, 10000);
  //7200000 + Math.floor(Math.random() * (0 - 600000 + 1)) + 600000
  //rest of code will be performing for iOS on background too
};

export const StopBackTimer = () => {
  BackgroundTimer.stopBackgroundTimer();
};
