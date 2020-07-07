import { connect } from 'react-redux';
import React, { Component } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { common } from '../../constants/common';
import NextTouchableOpacity from '../../components/NextTouchableOpacity';
import TKButton from '../../components/TKButton';

class ShowMnemonicWords extends Component {

  static navigationOptions(props) {
    // let params = props.navigation.state.params;
    // return {
    //   header: info => null,
    // };
    return {
      headerTitle: '助记词',
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
      words: []
    };
    this.tipArray = [
      '禁止截屏，并注意周围是否有摄像头',
      '请在纸质文本上正确抄写，抄完后隔离网络保存，禁止以任何形式或方法将助记词透露或公开',
      '请认真按顺序抄写下方24个助记词，我们将在下一步验证'
    ]
  }

  componentDidMount() {
    const { mnemonic } = this.props;
    if (mnemonic) {
      let wordArray = mnemonic.split(' ');
      this.setState({ words: wordArray });
    }
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
      <View style={{ marginVertical: common.margin10, justifyContent: 'center' }}>
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
      <View
        style={{
          marginVertical: common.margin10,
          justifyContent: 'center',
          alignItems: 'center',
          paddingLeft: common.margin10,
        }}>
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
    this.props.navigation.navigate('VerifyWrods')
  }

  render() {
    return (

      <View
        style={{
          backgroundColor: common.bgColor,
        }}>
        <FlatList
          style={{ backgroundColor: common.whiteColor }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={item => this.renderRow(item.item)}
          data={this.tipArray}
          ListHeaderComponent={() => this.renderHeader()}
        />
        <FlatList
          style={{ marginTop: common.margin40, backgroundColor: common.whiteColor }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={item => this.renderWordRow(item.item)}
          data={this.state.words}
          numColumns={4}
        />
        <View style={{ marginTop: common.margin40 }}>
          <TKButton
            style={{ borderRadius: common.margin15, }}
            theme="blue"
            titleStyle={{ color: '#fff', fontSize: 16 }}
            caption={'下一步'}
            onPress={() => { this.jumpToNext() }}
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

export default connect(mapStateToProps)(ShowMnemonicWords);