import { connect } from 'react-redux';
import React, { Component } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { common } from '../../constants/common';
import NextTouchableOpacity from '../../components/NextTouchableOpacity';
import TKButton from '../../components/TKButton';

export default class VerifyWrodsCell extends Component {

  constructor(props) {
    super(props);
    this.state = {
      words: [],
      checkWords: [],
    };

  }

  componentDidMount() {
    const { value } = this.props;
    let newArray = value.map((item, index) => {
      let configDic = { key: index, value: item, enabled: true }
      return configDic;
    });
    this.setState({ words: newArray });
  }




  onCheckWordPress = (item) => {
    const { words, checkWords } = this.state;
    const { onPress } = this.props;
    let newCheckWords = checkWords.filter(checkWord => checkWord.key !== item.key);
    let newWords = words.map((word, newIndex) => {
      if (word.key === item.key) {
        word.enabled = true;
      }
      return word;
    });
    if (onPress) onPress(newCheckWords);
    this.setState({ checkWords: newCheckWords, words: newWords });


    // this.setState({ checkWords: newCheckWords });
  }

  renderRow = (item, index) => {
    const { type } = this.props;
    return (
      <NextTouchableOpacity
        activeOpacity={common.activeOpacity}
        onPress={() => this.onCheckWordPress(item)}
        delay={100}
      >
        <View style={{ marginVertical: common.margin5, justifyContent: 'center' }}>
          <Text
            style={{
              color: common.textColor,
              fontSize: common.font16,
              marginLeft: common.margin10
            }}>
            {item.value}
          </Text>
        </View>
      </NextTouchableOpacity>
    );
  };

  onWordPress = (value, key) => {
    const { words, checkWords } = this.state;
    const { onPress } = this.props;
    let newWords = words.map(item => {
      if (key === item.key) {
        item.enabled = false
      }
      return item;
    })
    checkWords.push({key, value});
    if (onPress) onPress(checkWords);
    // console.warn(checkWords);
    this.setState({ words: newWords, checkWords });
  }

  renderWordRow = (item, index) => {
    return (
      <NextTouchableOpacity
        activeOpacity={common.activeOpacity}
        disabled={!item.enabled}
        onPress={() => this.onWordPress(item.value, index)}
        delay={100}
      >
        <View
          style={{
            marginVertical: common.margin5,
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: common.margin10,
            backgroundColor: item.enabled ? common.whiteColor : 'black'
          }}>
          <Text
            style={{
              color: common.textColor,
              fontSize: common.font16,
            }}>
            {item.value}
          </Text>
        </View>
      </NextTouchableOpacity>
    );
  };

  

  render() {
    return (

      <View
        style={{
          backgroundColor: common.bgColor,
        }}>
        <FlatList
          style={{ height: common.getH(200) }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => this.renderRow(item, index)}
          data={this.state.checkWords}
          numColumns={4}
        />
        <FlatList
          style={{ marginTop: common.margin40, height: common.getH(200) }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => this.renderWordRow(item, index)}
          data={this.state.words}
          extraData={this.state} 
          numColumns={4}
        />


      </View>
    );
  }
}



