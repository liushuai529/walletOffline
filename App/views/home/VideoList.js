import React, { Component } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { common } from '../../constants/common'



export default class VideoList extends Component {

  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: '视频列表',
      headerTintColor: common.navTitleColor,
      headerStyle: {
        backgroundColor: common.navBgColor,
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerTitleStyle: {
        flex: 1,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: common.font17,
      },
    };
  };

  constructor() {
    super()
    this.state = {
      videoList: [
        {
          path: require('../../resource/assets/account_mid.png'),
          title: '测试标题内容测试标题内容阿斯顿发内容测试标题内容',
          time: '2020-02-15',
          playNum: '15.9万播放'
        },
        {
          path: require('../../resource/assets/account_mid.png'),
          title: '测试标题内播放是收到粉丝发试标题内容测试标题内容',
          time: '2020-02-15',
          playNum: '15.9万播放'
        },
        {
          path: require('../../resource/assets/account_mid.png'),
          title: '测试标题内阿斯顿发是放大收到发生的的发收到发生发顺丰测试标题内容测试标题内容',
          time: '2020-02-15',
          playNum: '15.9万播放'
        },
        {
          path: require('../../resource/assets/account_mid.png'),
          title: '测试标题内容测试标题内容测试标题内容测试标题内容',
          time: '2020-02-15',
          playNum: '15.9万播放'
        },
        {
          path: require('../../resource/assets/account_mid.png'),
          title: '测试标题内容测试标题内容测试标题内容测试标题内容',
          time: '2020-02-15',
          playNum: '15.9万播放'
        },
        {
          path: require('../../resource/assets/account_mid.png'),
          title: '测试标题内容测试标题内容测试标题内容测试标题内容',
          time: '2020-02-15',
          playNum: '15.9万播放'
        },
        {
          path: require('../../resource/assets/account_mid.png'),
          title: '测试标题内容测试标题内容测试标题内容测试标题内容',
          time: '2020-02-15',
          playNum: '15.9万播放'
        },
        {
          path: require('../../resource/assets/account_mid.png'),
          title: '测试标题内容测试标题内容测试标题内容测试标题内容',
          time: '2020-02-15',
          playNum: '15.9万播放'
        },
        {
          path: require('../../resource/assets/account_mid.png'),
          title: '测试标题内容测试标题内容测试标题内容测试标题内容',
          time: '2020-02-15',
          playNum: '15.9万播放'
        }
      ]
    }
  }

  renderVideoItem({ item, index }) {
    return (
      <View style={styles.videoItemContainer}>
        <Image style={styles.videoImage} resizeMode="stretch" source={item.path}></Image>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.videoTime}>
            <Text style={styles.videoTimeText}>{item.time}</Text>
            <Text style={[styles.videoTimeText, { marginLeft: common.margin20 }]}>{item.playNum}</Text>
          </View>
        </View>
      </View>
    )

  }


  render() {
    console.warn(this.state.videoList)
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.videoList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderVideoItem}
          extraData={this.state}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
    paddingHorizontal: common.margin5,
  },
  videoItemContainer: {
    flexDirection: 'row',
    width: common.sw,
    flex: 1,
    marginTop: common.margin10,
  },
  videoImage: {
    width: common.getH(120),
    height: common.getH(80),
  },
  videoInfo: {
    justifyContent: 'center',
    alignContent: 'center',
    marginLeft: common.margin10,
    width: common.sw - common.getH(140)
  },
  videoTitle: {
    color: 'white',
    fontSize: common.font16
  },
  videoTime: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  videoTimeText: {
    color: 'white',
    fontSize: common.font14
  }
})
