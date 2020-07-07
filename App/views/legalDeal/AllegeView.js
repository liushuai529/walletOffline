import React, { PureComponent } from 'react'
import {
  Text,
  View,
  Keyboard,
  TextInput,
  StyleSheet,
} from 'react-native'
import {
  common,
} from '../../constants/common'
import NextTouchableOpacity from '../../components/NextTouchableOpacity'
import transfer from '../../localization/utils'

const styles = StyleSheet.create({
  contant: {
    alignSelf: 'center',
    marginTop: -common.getH(140),
    width: '80%',
    backgroundColor: 'white',
    borderRadius: common.radius6,
  },
  title: {
    marginTop: common.getH(10),
    textAlign: 'center',
    color: common.blackColor,
    fontSize: common.font12,
  },
  underline: {
    marginTop: common.getH(10),
    marginLeft: common.getH(10),
    marginRight: common.getH(10),
    backgroundColor: common.lineColor,
    height: common.getH(1),
  },
  inputView: {
    marginTop: common.getH(10),
    marginLeft: common.getH(20),
    marginRight: common.getH(20),
    flexDirection: 'row',
  },
  inputTitle: {
    color: common.blackColor,
    fontSize: common.font12,
  },
  input: {
    padding: 0,
    marginLeft: common.getH(10),
    paddingLeft: common.getH(5),
    paddingBottom: common.getH(5),
    paddingRight: common.getH(5),
    paddingTop: common.getH(5),
    height: common.getH(70),
    flex: 1,
    borderColor: common.lineColor,
    borderWidth: 1,
    color: common.placeholderColor,
    fontSize: common.font10,
  },
  tip: {
    marginTop: common.getH(10),
    marginLeft: common.getH(20),
    marginRight: common.getH(20),
    color: common.blackColor,
    fontSize: common.font10,
    lineHeight: common.getH(13),
    letterSpacing: common.getH(0.5),
  },
  cancelBtnView: {
    marginTop: common.getH(10),
    marginBottom: common.getH(10),
    marginLeft: common.getH(20),
    marginRight: common.getH(20),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  cancelBtn: {
    height: common.getH(30),
    width: common.getH(70),
    borderColor: common.lineColor,
    borderWidth: 1,
    justifyContent: 'center',
  },
  confirmBtn: {
    height: common.getH(30),
    width: common.getH(70),
    backgroundColor: common.btnTextColor,
    justifyContent: 'center',
  },
  cancelTitle: {
    color: common.blackColor,
    fontSize: common.font12,
    alignSelf: 'center',
  },
})

export default class AllegeView extends PureComponent {
  render() {
    const {
      style,
      onPress,
      inputValue,
      onChangeText,
      placeholder,
      cancelPress,
      confirmPress,
      language,
    } = this.props

    return (
      <NextTouchableOpacity
        style={style}
        activeOpacity={common.activeOpacity}
        onPress={onPress}
      >
        <NextTouchableOpacity
          style={styles.contant}
          activeOpacity={1}
          onPress={() => Keyboard.dismiss()}
        >
          <Text style={styles.title}>{transfer(language, 'Allege_complaints')}</Text>
          <View style={styles.underline} />
          <View style={styles.inputView}>
            <Text style={styles.inputTitle}>{transfer(language, 'Allege_cause')}</Text>
            <TextInput
              style={styles.input}
              multiline
              placeholder={placeholder}
              placeholderTextColor={common.lineColor}
              value={inputValue}
              onChangeText={onChangeText}
              underlineColorAndroid="transparent"
            />
          </View>
          <Text style={styles.tip}>
            <Text>{transfer(language, 'Allege_note_1')}</Text>
            {/* <Text style={{ letterSpacing: common.getH(0) }}>service@tok.com</Text> */}
            {/* <Text>{transfer(language, 'Allege_note_2')}</Text> */}
          </Text>
          <View style={styles.underline} />
          <View style={styles.cancelBtnView}>
            <NextTouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={common.activeOpacity}
              onPress={cancelPress}
            >
              <Text style={styles.cancelTitle}>{transfer(language, 'Allege_cancel')}</Text>
            </NextTouchableOpacity>
            <NextTouchableOpacity
              style={styles.confirmBtn}
              activeOpacity={common.activeOpacity}
              onPress={confirmPress}
            >
              <Text style={styles.cancelTitle}>{transfer(language, 'Allege_confrim')}</Text>
            </NextTouchableOpacity>
          </View>
        </NextTouchableOpacity>
      </NextTouchableOpacity>
    )
  }
}
