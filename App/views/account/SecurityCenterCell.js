import React, { PureComponent } from 'react'
import { Image, Text, View } from 'react-native'
import { common } from '../../constants/common'
import NextTouchableOpacity from '../../components/NextTouchableOpacity'

const styles = {
  container: {
    height: common.h50,
    width: '100%',
    backgroundColor: common.bgColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
		borderBottomWidth: 0.5,
		borderColor: common.placeholderColor
  },
  rightDir: {
    marginLeft: 10,
    width: common.w10,
    height: common.h20,
		tintColor: common.textColor
  },
  title: {
    color: '#DFE4FF',
    fontSize: 14,
    flex: 1,
    textAlign: 'left',
  },
  detail: {
    color: '#616989',
    fontSize: 12,
    textAlign: 'right',
  },
}

export default class SecurityCenterCell extends PureComponent {
  render() {
    const { viewStyle, title, detail, onPress } = this.props
    return (
      <NextTouchableOpacity
        {...this.props}
        style={[styles.container, viewStyle]}
        activeOpacity={common.activeOpacity}
        onPress={() => {
          if (onPress) {
            onPress()
          }
        }}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.detail}>{detail}</Text>
        <Image
          style={styles.rightDir}
					source={require('../../resource/assets/arrow_right.png')}
        />
      </NextTouchableOpacity>
    )
  }
}

