import React, { Component } from 'react'
import { View, StyleSheet, Text, ProgressBarAndroid,TouchableWithoutFeedback } from 'react-native'
import { common } from '../../constants/common'
import transfer from '../../localization/utils'

const styles = StyleSheet.create({
  container: {
    width: common.sw-common.margin20,
    paddingVertical: common.margin10,
		backgroundColor: common.navBgColor,
    borderRadius: common.h10,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

class DownItem extends Component {



  constructor(props) {
    super(props)
  }
  componentDidMount() {

  }
  componentWillMount() {
  }


  componentWillReceiveProps(nextProps) {
  }


  _renderShowModel = (attachmentItem) => {

    console.warn('下载信息', attachmentItem);
    const fileUrl = attachmentItem.url;
    const showName = attachmentItem.name;

    if (!attachmentItem.isFaild && attachmentItem.progress === 0) {
      return (
        <TouchableWithoutFeedback

          onPress={() => {
            if (this.props.handleDownLoadFile) {
              this.props.handleDownLoadFile();
            }
          }}
          activeOpacity={common.activeOpacity}
          delay={200}
        >
          <View style={{ justifyContent: 'center', width: common.getH(60), height: common.margin40 }}>
            <Text style={{ color: '#ffffff', fontSize: common.font16, textAlign: 'right' }}>下载</Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }
    if (attachmentItem.isDownLoad && attachmentItem.progress < 100) {
      return (
        <View style={{ justifyContent: 'center', width: common.getH(60), height: common.margin40 }}>
          <Text style={{ color: '#ffffff', fontSize: common.font16, textAlign: 'right' }}>{attachmentItem.progress}</Text>
        </View>
      )
    }
    if (attachmentItem.isFaild) {
      return (
        <TouchableWithoutFeedback

          onPress={() => {
            if (this.props.handleDownLoadFile) {
              this.props.handleDownLoadFile();
            }
          }}
          activeOpacity={common.activeOpacity}
          delay={200}
        >
          <View style={{ justifyContent: 'center', width: common.getH(80), height: common.margin40 }}>
            <Text style={{ color: '#ffffff', fontSize: common.font16, textAlign: 'right' }}>重新下载</Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }
    if (attachmentItem.progress === 100) {
      return (
        <TouchableWithoutFeedback

          onPress={() => {
            this.props.handleOpenFile()
          }}
          activeOpacity={common.activeOpacity}
          delay={200}
        >


          <View style={{ justifyContent: 'center', width: common.getH(60), height: common.margin40 }}>
            <Text style={{ color: '#ffffff', fontSize: common.font16, textAlign: 'right' }}>安装</Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }
  }


  render() {
    const { language } = this.props;
    return (
      <View style={styles.container}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: common.margin40,
        }}>
          <ProgressBarAndroid
            styleAttr="Normal"
            indeterminate={false}
            progress={this.props.attachmentItem.progress / 100}
            color="white"
            style={{ height: common.margin30 }}
          />
          <Text style={{ color: '#fff', fontSize: common.font20, textAlign: 'center' }}>
          {transfer(language, 'home_downloading')}({`${this.props.attachmentItem.progress}%`})
          </Text>


        </View>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={this.props.attachmentItem.progress / 100}
          color="white"
          style={{ width: '95%', height: common.margin20, marginTop: common.margin20, marginBottom: common.margin20 }}
        />
      </View>
    )
  }

}





export default DownItem;
