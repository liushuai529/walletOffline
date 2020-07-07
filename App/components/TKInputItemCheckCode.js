import React, { Component } from 'react'
import TKInputItem from './TKInputItem'
import TKCheckCodeBtn from './TKCheckCodeBtn'

class TKInputItemCheckCode extends Component {
  onChangeText = (text) => {
    if (this.props.onTextChanged) {
      this.props.onChangeText(text)
    }
  }

  onChange = (e) => {
    if (this.props.onChange) {
      this.props.onChange(e)
    }
  }

  clear = () => {
    this.textInputCodeRef.clear()
  }

  renderCheckCodeBtn = () => (
    <TKCheckCodeBtn
      language={this.props.language}
      extraDisable={this.props.extraDisable}
      onPress={() => {
        if (this.props.onPressCheckCodeBtn) {
          this.props.onPressCheckCodeBtn()
        }
      }}
    />
  )

  render() {
    return (
      <TKInputItem
        viewStyle={this.props.viewStyle}
        inputStyle={this.props.inputStyle}
        titleStyle={this.props.titleStyle}
        ref={(e) => { this.textInputCodeRef = e }}
        value={this.props.value}
        defaultValue={this.props.defaultValue}
        placeholder={this.props.placeholder}
        keyboardType={this.props.keyboardType}
        maxLength={this.props.maxLenth}
        onChange={e => this.onChange(e)}
        onChangeText={text => this.onChangeText(text)}
        editable={this.props.editable}
        title={this.props.title}
        extra={this.renderCheckCodeBtn}
        onFocus={this.props.onFocus}
      />
    )
  }
}

export default TKInputItemCheckCode
