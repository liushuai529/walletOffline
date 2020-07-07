import React from 'react';
import {
  Image,
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  Modal,
  ImageBackground,
  FlatList,
  ScrollView,
  DeviceEventEmitter,
} from 'react-native';
import { connect } from 'react-redux';
import { common } from '../../constants/common';
import HomeSwiper from './HomeSwiper';
import FastImage from 'react-native-fast-image';
import VideoPlayer from './VideoPlayer'
import Orientation from 'react-native-orientation';
import {
  requestVideoHistory,
  updateForm
} from '../../redux/actions/home';


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [

      ],
      banners: [
        { path: require('../../resource/assets/account_mid.png') },
        { path: require('../../resource/assets/assets_bg.png') },
      ],
      isFullScreen: false,
      //index1: 0
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(requestVideoHistory())
    DeviceEventEmitter.addListener('closeFullScreen', item => {
      Orientation.lockToPortrait();
    })

    //Orientation.lockToLandscape();
  }

  componentWillMount() {
  }


  componentWillUnmount() {
  }

  componentWillReceiveProps(nextprops) {
    const { historyList, currentIndex } = nextprops;
    if (historyList.length && this.props.historyList !== historyList) {
      this.setState({ history: historyList })
    }
    if (currentIndex !== this.props.currentIndex) {
      console.warn('qiehuan', this.props.currentIndex, currentIndex)
      this.historyFlastList.scrollToIndex({ viewPosition: 0, index: 0 });
    }
  }



  renderHistoryItem = ({ item, index }) => {
    const { dispatch, currentIndex, } = this.props;
    let style = index === currentIndex ? { borderColor: 'gray', borderWidth: 1 } : null;
    return (
      <TouchableWithoutFeedback onPress={() => { dispatch(updateForm({ currentIndex: index })); }}>
        <View style={styles.historyItem}>
          <View style={[styles.historyImageContainer, style]}>
            <Image style={styles.historyImage} resizeMode="stretch" source={{ uri: item.image }}></Image>
            <Text style={styles.historyImageText} numberOfLines={2}>{item.subtitle}</Text>
          </View>

        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderRecommendItem = ({ item, index }) => {
    // this.state.history.length && index === this.state.history.length-1 ? { marginBottom: common.margin5}: null
    const { navigation } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => { navigation.navigate('ProductInfo') }}>
        <View style={[styles.recommendListItem, { marginLeft: common.margin5 },]}>
          <View style={[styles.recommendItem,]}>
            <Image style={styles.recommendImage} resizeMode="stretch" source={item.path}></Image>
            <View style={styles.recommendInfoContainer}>
              <Text style={styles.recommendName}>产品名称</Text>
              <Text style={styles.recommendInfo}>产品价格: 2000</Text>
              <Text style={styles.recommendInfo}>交易量</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  toggleFullScreen = (isFullScreen) => {
    console.warn('横屏标识', isFullScreen)
    this.setState({ isFullScreen: isFullScreen })
  }



  render() {
    const { navigation } = this.props
    const { isFullScreen } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="rgb(39,39,41)" />
        <ScrollView
        //refreshControl={this.renderRefreshControl()}
        //showsVerticalScrollIndicator={false}
        >
          <View style={styles.video}>
            <VideoPlayer
              isFullScreen={isFullScreen}
              toggleFullScreen={this.toggleFullScreen}
              historyList={this.state.history}
              currentIndex={this.props.currentIndex}
            />

          </View>
          <View style={styles.historyHead}>
            <Text style={[styles.historyHeadText, { color: '#ffffff' }]}>往期节目</Text>
            <TouchableWithoutFeedback onPress={() => { navigation.navigate('VideoList') }}>
              <View style={styles.historyMore}>
                <Text style={[styles.historyHeadText, { color: common.themeColor }]}>更多精彩内容</Text>
                <Text style={[styles.historyHeadText, { color: common.themeColor }]}>箭头</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.historyList}>
            <FlatList
              ref={(ref) => {
                this.historyFlastList = ref
              }}
              data={this.state.history}
              horizontal={true}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderHistoryItem}
              extraData={[this.props, this.state]}
            />
          </View>
          <HomeSwiper
            banners={this.state.banners}
            onPress={(e) => {
              //console.log("Kline: HomeSwiper=====",JSON.stringify(e));
              if (e.type === 'Banner' && !e.element.hyperlink) return;
              navigation.navigate(e.type, { element: e.element })
            }}
          />
          <View style={styles.marketHead}>
            <Text style={styles.marketHeadText}>矿机商城</Text>
            <View style={styles.marketHeadLine}></View>
          </View>
          <View style={styles.market}>
            <TouchableWithoutFeedback onPress={() => { alert('进入商城') }}>
              <FastImage
                style={styles.marketImage}
                resizeMode="stretch"
                source={require('../../resource/assets/account_mid.png')}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.recommendHead}>
            {/* <View style={styles.recommendHeadLine}></View> */}
            <Text style={styles.recommendHeadText}>为您推荐</Text>

            <TouchableWithoutFeedback onPress={() => { navigation.navigate('OrderManageListTab') }}>
              <Text style={styles.recommendHeadText}>订单管理</Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.recommendList}>
            <FlatList
              data={this.state.history}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderRecommendItem}
              numColumns={2}
              extraData={this.state}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
  },
  video: {
    flex: 1
  },
  historyHead: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: common.margin10,
  },
  historyHeadText: {
    fontSize: common.font18
  },
  historyMore: {
    flexDirection: 'row'
  },
  historyList: {
    flex: 1,
    marginTop: common.margin10
  },
  historyItem: {
    flex: 1,
    marginRight: common.margin5,
  },
  historyImageContainer: {
    width: common.getH(200),
    backgroundColor: common.navBgColor,
  },
  historyImage: {
    width: common.getH(198),
    height: common.getH(80),
  },
  historyImageText: {
    color: '#ffffff',
    fontSize: common.font14,
    marginVertical: common.margin5,
    height: common.getH(40),
  },
  marketHead: {
    alignItems: 'center',
    marginTop: common.margin10
  },
  marketHeadText: {
    color: common.themeColor,
    fontSize: common.font18
  },
  marketHeadLine: {
    marginTop: common.margin5,
    height: common.getH(2),
    width: common.margin20,
    backgroundColor: common.themeColor,
  },
  market: {
    width: common.sw,
    height: common.getH(150),
    marginTop: common.margin10,
  },
  marketImage: {
    width: common.sw,
    height: common.getH(150),
  },
  recommendHead: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: common.margin5,
    justifyContent: 'space-between'
  },
  recommendHeadLine: {
    height: common.margin10,
    width: common.getH(2),
    backgroundColor: common.themeColor,
    marginLeft: common.margin10,
  },
  recommendHeadText: {
    color: common.themeColor,
    fontSize: common.font18,
    marginLeft: common.margin10,
  },
  recommendList: {
    flex: 1,
    marginHorizontal: common.margin5,
    marginTop: common.margin10,
  },
  recommendListItem: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: (common.sw - common.margin10) / 2,
    marginTop: common.margin10,
  },
  recommendItem: {
    flex: 1,
  },
  recommendImage: {
    width: (common.sw - common.margin30) / 2,
    height: common.getH(100),
  },
  recommendInfoContainer: {
    marginLeft: common.margin5,
    marginTop: common.margin5,
    backgroundColor: common.navBgColor,
    paddingLeft: common.margin5,
    justifyContent: 'center',
    paddingBottom: common.margin10,
  },
  recommendName: {
    color: '#ffffff',
    fontSize: common.font16,
    marginTop: common.margin5,
  },
  recommendInfo: {
    color: '#ffffff',
    fontSize: common.font14,
    marginTop: common.margin5,
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

function mapStateToProps(state) {
  return {
    ...state.home,
    ...state.system,
    ...state.login,
    login: state.login,
  };
}

export default connect(mapStateToProps)(Home);
