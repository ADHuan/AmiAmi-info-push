import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Text,
  Alert,
  Modal,
  TouchableHighlight,
  TextInput,
  TouchableOpacity,
  Linking,
  Switch,
} from 'react-native';
import Spinner from 'react-native-spinkit';
import AmiItem from './AmiItem';
import {
  IsBackSrv,
  StartBackSrv,
  StartBackTimer,
  StopBackSrv,
  StopBackTimer,
} from './BackSrv';
import styles from './ItemListStyle';
import {PushSrv} from './PushSrv';
import storage from './storage';

let DATA: any[] = [
  //   {
  //     url: 'https://www.amiami.com/cn/detail/?gcode=FIGURE-050571',
  //     id: '001',
  //     canbuy: false,
  //     gcode: 'FIGURE-050571',
  //     gname: 'METAL BUILD 命运高达',
  //   },
];

//开启订阅服务
//StartBackTimer();

const ItemList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [disSpinner, setDisSpinner] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  let delitem: any;

  useEffect(() => {
    console.log(IsBackSrv());

    if (IsBackSrv()) {
      setIsEnabled(true);
    }
    refreshStatus();
  }, [delitem]);

  const refresh = () => {
    setDisSpinner(true);
    setTimeout(() => {
      storage.getAllDataForKey('AmiItem').then(items => {
        console.log('refresh');
        console.log(items);
        DATA = items;
        setDisSpinner(false);
      });
    }, 20);
  };

  const refreshStatus = () => {
    setDisSpinner(true);
    setTimeout(() => {
      storage.getAllDataForKey('AmiItem').then(async items => {
        console.log('refreshStatus');
        //console.log(items);

        const doitems = async () => {
          await Promise.all(
            items.map(async (ele: any) => {
              return new Promise<void>((resolve, reject) => {
                // console.log('数据库中数据');

                // console.log(ele);
                const tempitem = new AmiItem(ele.url, ele.id);

                tempitem.onGet = async () => {
                  //   console.log('刷新后数据');
                  //   console.log(tempitem);
                  //   console.log('等于测试');
                  //   console.log(ele.canbuy);
                  //   console.log(tempitem.canbuy);
                  //   console.log(ele.canbuy != tempitem.canbuy);
                  if (ele.canbuy != tempitem.canbuy) {
                    await storage.remove({key: 'AmiItem', id: tempitem.id});
                    console.log('有变化');

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

        refresh();
      });
    }, 20);
  };

  const Item = ({item}: any) => {
    let canbuy;
    let canbuystyle;
    let itemstyle;

    if (item.canbuy) {
      canbuy = '可以购买！';
      itemstyle = styles.itemHighlight;
      canbuystyle = styles.highlightRed;
    } else {
      canbuy = '无法购买';
      itemstyle = styles.item;
      canbuystyle = styles.highlight;
    }

    const confirmDel = () => {
      Alert.alert(
        '确认删除该商品的订阅吗？',
        '',
        [
          {
            text: '确认',
            onPress: async () => {
              console.log('删除测试rr');

              console.log(item);

              delitem = item;
              await storage.remove({
                key: 'AmiItem',
                id: item.id,
              });
              refresh();
            },
            style: 'destructive',
          },
          {
            text: '取消',
            onPress: () => {},
            style: 'cancel',
          },
        ],
        {
          cancelable: true,
          onDismiss: () =>
            Alert.alert(
              'This alert was dismissed by tapping outside of the alert dialog.',
            ),
        },
      );
    };

    return (
      <View style={itemstyle}>
        <Text>
          <Text style={styles.highlight}>网址：</Text>
          {item.url}
        </Text>
        <Text>
          <Text style={styles.highlight}>名称：</Text>
          {item.gname}
        </Text>
        <Text>
          <Text style={styles.highlight}>状态: </Text>
          <Text style={canbuystyle}>{canbuy}</Text>
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 10,
          }}>
          <TouchableOpacity
            style={{...styles.itemButton, backgroundColor: 'cornflowerblue'}}
            onPress={() => {
              Linking.openURL(item.url);
            }}>
            <Text style={styles.textStyle}>打开网址</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{...styles.itemButton, backgroundColor: 'darkred'}}
            onPress={() => {
              confirmDel();
            }}>
            <Text style={styles.textStyle}>删除订阅</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const HeaderComponent: React.FC = () => {
    const toggleSwitch = () => {
      setIsEnabled(previousState => !previousState);
      console.log(!isEnabled);

      if (!isEnabled) {
        StartBackSrv();
      } else {
        StopBackSrv();
      }
    };

    return (
      <View style={styles.container}>
        <Text style={{marginTop: 10, fontSize: 14, fontWeight: 'bold'}}>
          是否开启后台补货监测服务？
        </Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#2196F3' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    );
  };

  const FooterComponent: React.FC = () => {
    const [value, onChangeText] = useState('');
    const onSave = () => {
      try {
        const tempitem = new AmiItem(value);
        setModalVisible(false);
        setDisSpinner(true);
        tempitem.onGet = () => {
          DATA.push(tempitem.getinfo());
          storage.save({
            key: 'AmiItem',
            id: tempitem.id,
            data: tempitem.getinfo(),
          });
          setDisSpinner(false);
        };
      } catch (error) {
        //TODO：太他妈丑了，后面改下
        Alert.alert('网页地址格式错误，请检查！');
      }
    };
    const Loading: React.FC = () => {
      let distext = {display: 'none'};
      if (disSpinner) {
        distext = {display: 'flex'};
      }
      return (
        <View style={styles.centeredView}>
          <Spinner style={styles.spinner} type="Wave" isVisible={disSpinner} />
          <Text
            style={{
              ...(distext as any),
              color: 'slategray',
              marginTop: -10,
              marginBottom: 15,
            }}>
            Loading...
          </Text>
        </View>
      );
    };
    return (
      <View style={styles.centeredView}>
        <Loading />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>录入订阅信息</Text>
              <Text style={styles.modalText}>需要订阅的商品网页地址</Text>
              <TextInput
                style={styles.modalInput}
                autoFocus={true}
                placeholder={'请输入网址'}
                onChangeText={text => onChangeText(text)}
                value={value}
                autoCorrect={false}></TextInput>
              <TouchableHighlight
                style={{
                  ...styles.modalButton,
                  backgroundColor: '#2196F3',
                }}
                onPress={() => {
                  onSave();
                }}>
                <Text style={styles.textStyle}>保存</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{...styles.modalButton, backgroundColor: 'tomato'}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>取消</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <TouchableHighlight
          style={styles.openButton}
          onPress={() => {
            setModalVisible(true);
          }}>
          <Text style={styles.textStyle}>添加订阅</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={{...styles.openButton, backgroundColor: 'mediumseagreen'}}
          onPress={() => {
            refreshStatus();
          }}>
          <Text style={styles.textStyle}>刷新状态</Text>
        </TouchableHighlight>
      </View>
    );
  };
  const renderItem = ({item}: any) => <Item item={item} />;
  return (
    <FlatList
      data={DATA}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      ListHeaderComponent={HeaderComponent}
      ListFooterComponent={FooterComponent}
    />
  );
};

export default ItemList;
