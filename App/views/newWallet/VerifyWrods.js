import { connect } from 'react-redux';
import React, { Component } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { common } from '../../constants/common';
import NextTouchableOpacity from '../../components/NextTouchableOpacity';
import TKButton from '../../components/TKButton';
import VerifyWrodsCell from './VerifyWrodsCell';
import { Toast } from 'teaset';

class VerifyWrods extends Component {

  static navigationOptions(props) {
    return {
      headerTitle: '验证助记词',
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
      words: [],
    };
  }

  componentWillMount() {
    const { mnemonic } = this.props;
    let wordArray = mnemonic.split(' ');
    wordArray = this.randomWords(wordArray);
    this.setState({ words: wordArray })
  }

  componentDidMount() {

  }

  randomWords(arr) {
    var newarr = [];
    while (arr.length > 0) {
      var len = parseInt(Math.random() * arr.length);
      newarr.push(arr[len]);
      arr.splice(len, 1)
    }
    return newarr;
  }

  renderHeader = () => {
    const { type } = this.props;
    if (type === 'repassword') return null;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: common.textColor, fontSize: common.font18, fontWeight: 'bold', }}>您的助记词：</Text>
      </View>
    )
  }

  renderRow = item => {
    const { type } = this.props;
    return (
      <View style={{ marginVertical: common.margin10, alignItems: 'center' }}>
        <Text
          style={{
            color: common.textColor,
            fontSize: common.font16,
            marginLeft: common.margin10
          }}>
          {item}
        </Text>
      </View>
    );
  };

  renderWordRow = item => {
    return (
      <View>
        <Text
          style={{
            color: common.textColor,
            fontSize: common.font16,
          }}>
          {item}
        </Text>
      </View>
    );
  };

  jumpToNext = () => {
    const { screenProps } = this.props;
    if(this.checkWords.length !== 24) {
      Toast.fail('助记词错误，请重新输入');
      return;
    }
    if (this.checkMnemonic(this.checkWords)) {
      screenProps.dismiss()
    } else {
      Toast.fail('助记词错误，请重新输入');
      return;
    }
  }

  checkMnemonic = (checkWords) => {
    // this.props.mnemonic.split(' ').forEach((item, index) => {
    //   if(item !== checkWords[index].value) {
    //     return false;
    //   } 
    // })
    // return true


    // let result;
    let mnemonicArray = this.props.mnemonic.split(' ');
    for (var i = 0; i < mnemonicArray.length; i++) {
      if (mnemonicArray[i] !== checkWords[i].value) {
        return false;
      }
      // result = true
    }
    return true
  }

  render() {
    return (

      <View
        style={{
          backgroundColor: common.bgColor,
        }}>
        <Text style={{ color: common.textColor, fontSize: common.font16 }}>
          请将您抄写的24个单词按正确的顺序输入到下方
        </Text>
        <VerifyWrodsCell
          value={this.state.words}
          onPress={(arr) => {
            this.checkWords = arr
            // console.warn('object', this.checkWords);
          }}
        />

        <TKButton
          style={{ borderRadius: common.margin15, marginTop: common.margin20 }}
          theme="blue"
          titleStyle={{ color: '#fff', fontSize: 16 }}
          caption={'下一步'}
          onPress={() => { this.jumpToNext() }}
        />

      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.wallet,
  };
}

export default connect(mapStateToProps)(VerifyWrods);