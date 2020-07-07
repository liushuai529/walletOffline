import React, { Component } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { common } from '../../constants/common';
import { Toast, Overlay } from 'teaset';
import { updateForm } from '../../redux/actions/market';
import { withNavigation } from 'react-navigation';


class OrderManageList extends Component {


  constructor() {
    super()
    this.state = {
      orderList: [1, 2],
      feedback: '',
      isShow: false,
    }
  }

  componentDidMount() {
    // this.setState({
    //   feedback: 'sdfasfs'
    // })
  }



  onContentChange = (text) => {
    //console.warn('数据改变',this.state, text)
    this.setState({ feedback: text })
  }

  showOverlay = () => {
    const { feedback } = this.state;
    let overlayView = (
      <Overlay.View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        modal={false}
        overlayOpacity={0}>
        {/* <TouchableWithoutFeedback
          onPress={() => {
            this.hideOverlay();
          }}>
          <View style={styles.overlay_cover} />
        </TouchableWithoutFeedback> */}
        <View style={styles.overlayCover} />
        <View style={styles.overlayContainer}>
          <View style={styles.overlayHead}>
            <Text style={styles.orderItemHeadLeft}>反馈</Text>
            <TouchableWithoutFeedback
              onPress={() => {
                this.hideOverlay();
              }}>
              <Image
                style={styles.overlayCloseImg}
                source={require('../../resource/assets/close_icon.png')}
              />
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.overlayContent}>
            <ScrollView>
              <TextInput
                style={styles.overlayInput}
                placeholder={'请输入反馈内容'}
                placeholderTextColor={common.textColor}
                //underlineColorAndroid="transparent"
                keyboardType="default"
                // onChangeText={
                //   e => this.onContentChange(e)
                // }
                onChange={e => this.onContentChange(e)}
                value={this.state.feedback}
              />
            </ScrollView>
          </View>
          <View style={styles.overlayBtn}>
            <Text style={styles.overlayBtnText}>提交</Text>
          </View>
        </View>
      </Overlay.View>
    );
    this.hideOverlay();
    this.overlayViewKeyID = Overlay.show(overlayView);
  }

  hideOverlay() {
    Overlay.hide(this.overlayViewKeyID);
  }


  renderOrderItem = ({ item, index }) => {
    const { navigation } = this.props;
    return (
      <View style={styles.orderItemContainer}>
        <View style={styles.orderItemHead}>
          <Text style={styles.orderItemHeadLeft}>商品名称</Text>
          <Text style={styles.orderItemHeadRight}>已发货</Text>
        </View>
        <View style={styles.orderItemLine}></View>
        <View style={styles.orderItemContent}>
          <Image
            style={styles.orderItemImage}
            source={require('../../resource/assets/login_btn.png')}
          />
          <View style={styles.orderItemRight}>
            <View style={styles.orderItemInfo}>
              <Text style={styles.orderItemText}>下单时间:</Text>
              <Text style={[styles.orderItemText, { marginLeft: common.margin5 }]}>2019-11-26 12:00</Text>
            </View>
            <View style={styles.orderItemInfo}>
              <Text style={styles.orderItemText}>数量:</Text>
              <Text style={[styles.orderItemText, { marginLeft: common.margin5 }]}>1</Text>
            </View>
            <View style={styles.orderItemInfo}>
              <Text style={styles.orderItemText}>订单金额:</Text>
              <Text style={[styles.orderItemText, { marginLeft: common.margin5 }]}>123</Text>
            </View>
          </View>
        </View>
        <View style={styles.orderItemBtn}>
          {/* <TouchableWithoutFeedback onPress={() => { this.showOverlay() }}> */}
          <TouchableWithoutFeedback onPress={() => { this.setState({ isShow: true }) }}>
            <View style={styles.orderBtnContainer}>
              <Text style={styles.orderBtnText}>反馈</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => { navigation.navigate('OrderInfo', { type: 'search' }) }}>
            <View style={[styles.orderBtnContainer, { marginLeft: common.margin5 }]}>
              <Text style={styles.orderBtnText}>查看详情</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={[styles.orderBtnContainer, { marginLeft: common.margin5 }]}>
            <Text style={styles.orderBtnText}>确认收货</Text>
          </View>
        </View>





        {/* <Image style={styles.videoImage} resizeMode="stretch" source={item.path}></Image>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.videoTime}>
            <Text style={styles.videoTimeText}>{item.time}</Text>
            <Text style={[styles.videoTimeText, { marginLeft: common.margin20 }]}>{item.playNum}</Text>
          </View>
        </View> */}
      </View>
    )

  }


  render() {
    const { orderList } = this.props;
    return (
      <View style={styles.container}>
        <Modal
          animationType='none'
          transparent={true}
          style={{justifyContent: 'center', alignItems: 'center'}}
          onRequestClose={() => { this.setState({isShow: false}) }}
          visible={this.state.isShow}
        >
          <View style={styles.overlayCover} />
          <View style={styles.overlayContainer}>
            <View style={styles.overlayHead}>
              <Text style={styles.orderItemHeadLeft}>反馈</Text>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.setState({ isShow: false })
                }}>
                <Image
                  style={styles.overlayCloseImg}
                  source={require('../../resource/assets/close_icon.png')}
                />
              </TouchableWithoutFeedback>
            </View>

            <View style={styles.overlayContent}>
              <ScrollView>
                <TextInput
                  style={styles.overlayInput}
                  placeholder={'请输入反馈内容'}
                  placeholderTextColor={common.textColor}
                  keyboardType="default"
                  onChange={e => this.onContentChange(e)}
                  value={this.state.feedback}
                  multiline
                />
              </ScrollView>
            </View>
            <View style={styles.overlayBtn}>
              <Text style={styles.overlayBtnText}>提交</Text>
            </View>
          </View>
        </Modal>
        <FlatList
          data={this.state.orderList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderOrderItem}
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
  orderItemContainer: {
    width: common.sw - common.getH(10),
    paddingHorizontal: common.margin10,
    marginTop: common.margin10,
    backgroundColor: common.navBgColor,
  },
  orderItemHead: {
    justifyContent: 'space-between',
    height: common.margin40,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderItemHeadLeft: {
    fontSize: common.font20,
    color: '#ffffff',
  },
  orderItemHeadRight: {
    fontSize: common.font16,
    color: common.themeColor,
  },
  orderItemLine: {
    height: common.getH(1),
    width: common.sw - common.getH(30),
    backgroundColor: common.cutOffLine,
  },
  orderItemContent: {
    height: common.getH(80),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: common.margin10
    //width: common.sw - common.getH(30),
  },
  orderItemImage: {
    height: common.getH(60),
    width: common.getH(60),
    backgroundColor: 'yellow',
  },
  orderItemRight: {
    width: common.sw - common.getH(100),
    height: common.getH(80),
    marginLeft: common.margin10,
  },
  orderItemInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  orderItemText: {
    color: '#ffffff',
    fontSize: common.font16,
  },
  orderItemBtn: {
    height: common.getH(35),
    //width: common.sw - common.getH(120),
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    marginTop: common.margin10,
    marginBottom: common.margin20,
  },
  orderBtnContainer: {
    width: common.getH(80),
    justifyContent: 'center',
    borderRadius: common.margin5,
    borderColor: common.cutOffLine,
    borderWidth: common.getH(1),
  },
  orderBtnText: {
    color: '#ffffff',
    fontSize: common.font16,
    textAlign: 'center',
  },
  overlayCover: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    opacity: 0.7,
  },
  overlayContainer: {
    width: common.sw - common.getH(10),
    height: common.getH(220),
    marginLeft: common.margin5,
    marginTop: (common.sh - common.getH(300))/2,
    backgroundColor: common.navBgColor,
  },
  overlayHead: {
    height: common.margin40,
    paddingHorizontal: common.margin10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlayCloseImg: {
    width: common.margin20,
    height: common.margin20,
  },
  overlayContent: {
    height: common.getH(120),
    backgroundColor: common.navTitleColor,
  },
  overlayInput: {
    color: common.placeholderColor,
    fontSize: common.font14,
    width: common.sw - common.getH(30)
  },
  overlayBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBtnText: {
    color: common.themeColor,
    fontSize: common.font16,
    textAlign: 'center',
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

function mapStateToProps(state) {
  return {
    ...state.home,
    ...state.market,
    login: state.login,
  };
}

// export default connect(mapStateToProps)(OrderManageList);
export default connect(
  mapStateToProps,
)(withNavigation(OrderManageList))
