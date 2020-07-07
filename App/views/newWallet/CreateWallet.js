import { connect } from 'react-redux';
import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  FlatList,
  SectionList,
  TouchableWithoutFeedback,
  Modal,
  Animated,
  Text,
  NativeModules,
  CameraRoll,
  Dimensions,
  DeviceEventEmitter,
  Linking,
  Alert,
} from 'react-native';
import { common } from '../../constants/common';
import CreateWalletCell from './CreateWalletCell';
import TKButton from '../../components/TKButton';

// import Toast2 from 'antd-mobile/lib/toast';

import { updateCoinArray } from '../../redux/actions/wallet'

import NextTouchableOpacity from '../../components/NextTouchableOpacity';


class CreateWallet extends Component {
  static navigationOptions(props) {
    return {
      headerTitle: '创建钱包',
      headerLeft: (
        <NextTouchableOpacity
          style={{
            height: common.w40,
            width: common.w40,
            justifyContent: 'center',
          }}
          activeOpacity={common.activeOpacity}
          onPress={() => props.navigation.goBack()}>
          <Image
            style={{
              marginLeft: common.margin10,
              width: common.w10,
              height: common.h20,
            }}
            source={require('../../resource/assets/arrow_left.png')}
          />
        </NextTouchableOpacity>
      ),
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      detailData: {},
      data: [
        { name: 'BTC', checked: true, source: '' },
        { name: 'ETH', checked: true, source: '' },
      ],
    };
    this.checkData = [
      { name: 'BTC', checked: true, source: '' },
      { name: 'ETH', checked: true, source: '' },
    ]
  }
  componentDidMount() {
    // this.initRefreshData();
  }

  componentWillUnmount() {

  }




  componentWillReceiveProps(nextProps) {

  }










  refreshData() {

  }

  loadMoreData() {

  }

  renderFooter = () => {
    // if (this.state.offeringList.length < this.REQUST_COUNT) return null;
    // const {language} = this.props;

    // if (this.lastData.length >= this.REQUST_COUNT) {
    //   return (
    //     <View style={styles.fonterContainer}>
    //       <Text style={styles.fonterText}>
    //         {transfer(language, 'loading_more')}
    //       </Text>
    //     </View>
    //   );
    // } else {
    //   return (
    //     <View style={styles.fonterContainer}>
    //       <Text style={styles.fonterText}>
    //         {transfer(language, 'loading_no_date')}
    //       </Text>
    //     </View>
    //   );
    // }
  };

  jumpToCreateWallete = () => {
    const { dispatch } = this.props;
    if (!this.checkData.find(item => item.checked)) {
      Toast.fail("请选择币种");
      return;
    }
    dispatch(updateCoinArray(this.checkData.filter(item => item.checked)))
    this.props.navigation.navigate('SetPassword', { dispatch: this.props.dispatch });
  }

  renderHeader = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', paddingLeft: common.margin20 }}>
        <Text style={styles.recordHead}>请选择您想创建的钱包币种</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>



        <FlatList
          keyExtractor={(item, index) => index.toString()}
          renderItem={item => this.renderRow(item.item)}
          data={this.state.data}
          ListHeaderComponent={() => this.renderHeader()}

        />
        <View style={styles.bottomView}>
          <TKButton
            style={{ borderRadius: common.margin15 }}
            theme="blue"
            titleStyle={{ color: '#fff', fontSize: 16 }}
            caption={'确定'}
            onPress={() => { this.jumpToCreateWallete() }}
          />
        </View>


      </View>
    );
  }


  checkedWallete = (name) => {
    let newData = this.state.data.map(item => {
      if (name === item.name) {
        item.checked = !item.checked;
      }
      return item
    })
    this.setState({ data: newData })
    this.checkData = newData;
  }



  renderRow = item => {
    return (
      <View style={{ backgroundColor: common.bgColor }}>
        <CreateWalletCell
          leftImageSource={item.source}
          title={item.name}
          checked={item.checked}
          onPress={() => {
            this.checkedWallete(item.name);
          }}
        />
      </View>
    );
  };
}

function mapStateToProps(state) {
  return {
    ...state.wallet,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
  },
  bottomView: {
    position: 'absolute',
    width: common.sw,
    height: common.margin40,
    bottom: common.margin40,
  },
  recordHead: {
    color: common.textColor,
    fontSize: common.font18,
    fontWeight: 'bold',
  }





});

export default connect(mapStateToProps)(CreateWallet);
