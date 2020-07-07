import React, { PureComponent } from 'react'
import { TouchableOpacity } from 'react-native'

class NextTouchableOpacity extends PureComponent {
  press(onPress, delay = 1000) {
    let { target = 'self' } = this.props
    if (target === 'self') {
      target = this
    } else {
      target = global
    }
    if (target.didPress) {
      return
    }
    target.didPress = true
    onPress()
    setTimeout(() => {
      target.didPress = false
    }, delay)
  }

  render() {
    const { onPress, children, delay } = this.props
    return (
      <TouchableOpacity
        {...this.props}
        onPress={() => {
          if (onPress) {
            this.press(onPress, delay)
          }
        }}
      >
        {children}
      </TouchableOpacity>
    )
  }
}

module.exports = NextTouchableOpacity
