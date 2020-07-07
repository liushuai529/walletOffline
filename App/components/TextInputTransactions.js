import React, { Component } from 'react'
import {
  TextInput,
} from 'react-native'
import { common } from '../constants/common'

const styles = {
  textInput: {
    flex: 1,
    height: 27,
    fontSize: common.font12,
    color: '#ffffff',
    alignSelf: 'center',
    textAlign: 'center',
    padding: 0,
  },
}

export default class TextInputTranscations extends Component {
  componentDidMount() { }

  render() {
    const {
      textInputStyle,
      placeholder,
      value,
      onChangeText,
      keyboardType,
      editable,
      maxLength,
      onEndEditing,
      onFocus,
      onBlur,
    } = this.props
    return (
      <TextInput
        style={[styles.textInput, textInputStyle]}
        keyboardType={keyboardType}
        //placeholder={placeholder}
        //placeholderTextColor={common.placeholderColor}
        autoCorrect={false}
        value={value}
        numberOfLines={1}
        onChangeText={onChangeText}
        editable={editable}
        maxLength={maxLength}
        underlineColorAndroid="transparent"
        onEndEditing={onEndEditing}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    )
  }
}
