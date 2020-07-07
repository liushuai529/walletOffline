import React, { PureComponent } from 'react'
import Spinner from 'react-native-spinkit'
import { common } from '../constants/common'

export default class TKSpinner extends PureComponent {
  render() {
    return (
      <Spinner
        {...this.props}
        style={{
          position: 'absolute',
          alignSelf: 'center',
          marginTop: common.sh / 2 - common.h50 / 2,
        }}
        size={common.h50}
        type={'Wave'}
        color={common.themeColor}
      />
    )
  }
}
