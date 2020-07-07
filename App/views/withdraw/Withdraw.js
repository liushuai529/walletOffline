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
import WithdrawCell from './WithdrawCell';




class Withdraw extends Component {
  static navigationOptions(props) {
    return {
      headerTitle: '审核提币',
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      detailData: {},
      data: [
        { name: 'Doge(狗狗币)', amount: '1000', source: '', address: '1123u12io32232342342342', time: '2020-04-30 11:12:00' },
        { name: 'BitcoinCash(比特现金)', amount: '100', source: '', address: '1werwerd332232342342342', time: '2020-04-30 11:12:00' },
      ],

      offeringList: [],
      page: 0,
    };
    this.REQUST_COUNT = 20;
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

  renderHeader = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', paddingLeft: common.margin20 }}>
        <Text style={styles.recordHead}>提币请求记录</Text>
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

      </View>
    );
  }

  jumpToWithdrawDetail = item => {
    
    this.props.navigation.navigate('WithdrawDetails', { withdrawInfo: item });
  }



  renderRow = item => {
    let withdrawInfo = {
      amount: item.amount,
      address: item.address,
      fee: '0.0000001BTC',
      time: item.time,
    } 
    return (
      <View style={{ backgroundColor: common.bgColor }}>
        <WithdrawCell
          leftImageSource={item.source}
          title={item.name}
          detail={item.amount}
          onPress={() => {
            this.jumpToWithdrawDetail(withdrawInfo);
          }}
        />
      </View>
    );
  };
}

function mapStateToProps(state) {
  return {
    ...state.newsLetter,
   
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
  },
  head: {
    height: common.margin20,
    width: '100%',
    backgroundColor: '#3b4367',
  },
  headText: {
    color: 'white',
    marginLeft: common.margin10,
  },


  fonterContainer: {
    height: common.h40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fonterText: {
    color: common.textColor,
    fontSize: common.font14,
  },
  recordHead: {
    color: common.textColor,
    fontSize: common.font18,
    fontWeight: 'bold',
  }



});

export default connect(mapStateToProps)(Withdraw);
