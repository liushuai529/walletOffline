import { connect } from 'react-redux';
import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  Text,
  NativeModules,
} from 'react-native';
import { Toast } from 'teaset';
import { common } from '../../constants/common';
import TKButton from '../../components/TKButton';
import { updateMnemonic, updateSeed, updateCoinInfoArray, updateOperationType } from '../../redux/actions/wallet'

import cache from '../../utils/cache';


import NextTouchableOpacity from '../../components/NextTouchableOpacity';


class ImportWallet extends Component {
  static navigationOptions(props) {
    return {
      headerTitle: '导入钱包',
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
      data: [],
    };

  }
  componentDidMount() {

  }

  componentWillUnmount() {

  }




  componentWillReceiveProps(nextProps) {

  }



  jumpToCreateWallete() {
    this.props.navigation.navigate('CreateWallet')
  }

  updateWords = words => {
    this.setState({ words });
  };

  onConfirmWords() {
    if (!this.state.words) return;
    const { dispatch, navigation } = this.props;
    
    const CreateWallet = NativeModules.CreateWallet;
    CreateWallet.HDWalletIsValid(this.state.words.replace(/(\s*$)/g, ""), (error) => {
      if (!error) {
        
        dispatch(updateOperationType(1));
        cache.setObject('mnemic', this.state.words.replace(/(\s*$)/g, ""));
        navigation.navigate('SetPassword', { dispatch })

      } else {
        Toast.fail("助记词错误，请检查后重新输入")
      }

    })
  }







  render() {
    return (
      <View style={styles.container}>

        <Text>
          请将您抄写的24个单词按正确的顺序输入到下方
        </Text>
        <View style={{ height: common.getH(200), backgroundColor: common.whiteColor }}>
          <TextInput
            style={[styles.input, { height: common.getH(200) }]}
            allowFontScaling={false}
            autoCorrect={false}
            ref={input => (this.input = input)}
            placeholderTextColor={common.placeholderColor}
            placeholder={'英文单词请按空格分隔单词'}
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            onChangeText={words => this.updateWords(words)}
            value={this.state.words}
            // maxLength={2048}
            multiline={true}
            onFocus={() => {

            }}
          // onSelectionChange={e => {
          //   this.inputStart = e.nativeEvent.selection.start;
          //   this.inputEnd = e.nativeEvent.selection.end;
          // }}
          // onContentSizeChange={event => {
          //   this.setState({
          //     contentHeight: event.nativeEvent.contentSize.height,
          //   });
          // }}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <TKButton
            style={{ marginTop: common.margin30, borderRadius: common.margin15, width: common.getH(160) }}
            theme="blue"
            titleStyle={{ color: '#fff', fontSize: 16 }}
            caption={'确定'}
            onPress={() => { this.onConfirmWords() }}
          />
        </View>

      </View>
    );
  }
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
  backgroudView: {
    position: 'absolute',
    width: common.sw,
    height: common.sh,
    top: 0,
    left: 0,
    backgroundColor: 'gray',
  }






});

export default connect(mapStateToProps)(ImportWallet);
