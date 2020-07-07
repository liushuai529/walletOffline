import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'
import { common } from '../constants/common'
import NextTouchableOpacity from './NextTouchableOpacity'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: common.getH(2),
    marginRight: common.getH(2),
    borderBottomColor: common.lineColor,
    borderBottomWidth: 1,
  },
  titlesMiddleLine: {
    width: common.getH(1),
    top: common.getH(4),
    bottom: common.getH(4),
    backgroundColor: common.lineColor,
  },
  titleView: {
    marginTop: common.getH(10),
    marginBottom: common.getH(10),
    justifyContent: 'center',
  },
})

class BalanceAuthSelectionBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedIdx: props.initialIndexSelected || 0,
    }
  }

  itemOnPress(selectedIdx) {
    const { onPress, titles } = this.props
    onPress({
      index: selectedIdx,
      title: titles[selectedIdx],
    })
    this.setState({
      selectedIdx,
    })
  }

  item(index, title, selected) {
    const { barItemStyle } = this.props
    return (
      <NextTouchableOpacity
        key={index}
        style={[styles.titleView, barItemStyle]}
        activeOpacity={common.activeOpacity}
        onPress={() => this.itemOnPress(index)}
      >
        <Text
          style={{
            color: selected ? common.btnTextColor : common.blackColor,
             marginRight: common.getH(2),
             marginLeft: common.getH(2),
            fontSize: common.font12,
            alignSelf: 'center',
          }}
        >{title}</Text>
      </NextTouchableOpacity>
    )
  }

  renderTitles = () => {
    const { titles } = this.props
    return (
      <View style={styles.container}>
        {titles.map((title, index) => (
          index === (titles.length - 1) ? this.item(index, title, this.state.selectedIdx === index) : 
            [this.item(index, title, this.state.selectedIdx === index), <View style={styles.titlesMiddleLine} key={index+10000}/>]
        ))}
      </View>
    )
  }

  renderContent = () => {
    const { renderItem } = this.props
    const { selectedIdx } = this.state

    return renderItem(selectedIdx)
  }

  render() {
    return (
      <View>
        {this.renderTitles()}
        {this.renderContent()}
      </View>

    )
  }
}

export default BalanceAuthSelectionBar

