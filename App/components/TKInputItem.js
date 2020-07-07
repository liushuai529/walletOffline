import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
} from 'react-native'
import { common } from '../constants/common'
import NextTouchableOpacity from './NextTouchableOpacity'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: common.h40,

    backgroundColor: common.whiteColor,
    borderColor: common.borderColor,
    borderRadius: 1,
    borderWidth: 1,
  },
  titleContainer: {
    marginLeft: common.margin10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: common.textColor,
    fontSize: common.font12,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: common.margin10,
    alignSelf: 'center',
    padding: 0,
  },
  input: {
    color: common.textColor,
    fontSize: common.font12,
  },
  extraContainer: {
    marginRight: common.margin10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extra: {
    color: common.textColor,
    fontSize: common.font12,
  },
  delCoverStyle: {
    width: common.getH(38),
    height: common.getH(38),
    justifyContent: 'center',
    alignItems: 'center',
  },
  delImageStyle: {
    width: 17,
    height: 17,
  },
})

class TKInputItem extends Component {
  onChangeText = (text) => {
    if (this.props.onChangeText) {
      this.props.onChangeText(text)
    }
  }

  onChange = (e) => {
    if (this.props.onChange) {
      this.props.onChange(e)
    }
  }

  onFocus = (e) => {
    if (this.props.onFocus) {
      this.props.onFocus(e)
    }
  }

  clear = () => {
    this.textInputRef.clear()
  }

  renderTitle = () => {
    let titleView = null
    if (typeof this.props.title === 'function') {
      titleView = this.props.title()
    } else if (!this.props.title) {
      return null
    } else {
      titleView = (
        <Text style={[styles.title, this.props.titleStyle]}>
          {this.props.title}
        </Text>
      )
    }
    return (
      <View style={styles.titleContainer}>
        {titleView}
      </View>
    )
  }

  renderInput = () => {
    const {
      value,
      defaultValue,
      placeholder,
      inputStyle,
      maxLength,
      keyboardType,
      editable,
      secureTextEntry,
    } = this.props
    if (this.props.renderInput) {
      return this.props.renderInput()
    }
    return (
      <TextInput
        ref={(e) => { this.textInputRef = e }}
        style={[styles.inputContainer, styles.input, inputStyle]}
        autoCapitalize="none"
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        placeholderTextColor={common.placeholderColor}
        keyboardType={keyboardType}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        onChange={e => this.onChange(e)}
        onFocus={e => this.onFocus(e)}
        onChangeText={text => this.onChangeText(text)}
        editable={editable}
        autoFocus={this.props.autoFocus}
        enablesReturnKeyAutomatically
        underlineColorAndroid="transparent"
        {...this.props.textInputProps}
      />
    )
  }

  renderExtra = () => {
    let extraView = null
    if (typeof this.props.extra === 'function') {
      extraView = this.props.extra()
    } else if (!this.props.extra) {
      return extraView
    } else {
      extraView = (
        <Text style={[styles.extra, this.props.extraStyle]}>
          {this.props.extra}
        </Text>
      )
    }
    return (
      <View style={styles.extraContainer}>
        {extraView}
      </View>
    )
  }

  renderDelBtnIfNeeded() {
    const { showDelBtn, value = '' } = this.props
    if (showDelBtn) {
      if (value.length > 0) {
        return (
          <NextTouchableOpacity
            style={styles.delCoverStyle}
            activeOpacity={common.activeOpacity}
            onPress={() => this.onChange({
              nativeEvent: {
                text: '',
              },
            })}
          >
            <Image
              style={styles.delImageStyle}
              resizeMode="contain"
              source={require('../resource/assets/deleteAll.png')}
            />
          </NextTouchableOpacity>
        )
      }
    }
    return null
  }

  render() {
    const {
      onLayout,
    } = this.props
    return (
      <View
        style={[styles.container, this.props.viewStyle]}
        onLayout={onLayout}
      >
        {this.renderTitle()}
        {this.renderInput()}
        {this.renderExtra()}
        {this.renderDelBtnIfNeeded()}
      </View>
    )
  }
}

export default TKInputItem
