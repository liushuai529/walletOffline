import React, { PureComponent } from 'react'
import Camera from 'react-native-camera'
import { StyleSheet, View, Text } from 'react-native'
import QRScannerRectView from './QRScannerRectView'

const styles = StyleSheet.create({
  buttonsContainer: {
    position: 'absolute',
    height: 100,
    bottom: 0,
    left: 0,
    right: 0,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
  viewfinder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLeftCorner: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topRightCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bottomLeftCorner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  bottomRightCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  topMask: {
    position: 'absolute',
    top: 0,
  },
  leftMask: {
    position: 'absolute',
    left: 0,
  },
  rightMask: {
    position: 'absolute',
    right: 0,
  },
  bottomMask: {
    position: 'absolute',
    bottom: 0,
  },
})


/**
 * 扫描界面
 */
export default class QRScannerView extends PureComponent {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Camera
          onBarCodeRead={this.props.onScanResultReceived}
          style={{ flex: 1 }}
          permissionDialogTitle="相机请求权限"
          permissionDialogMessage="为了更好的使用App，请允许App访问你的相机。"
          notAuthorizedView={(
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                }}
              >
              请在手机设置中，允许App访问你的相机
              </Text>
            </View>
          )}
        >
          {/* 绘制顶部标题栏组件 */}
          {this.props.renderTopBarView()}

          {/* 绘制扫描遮罩 */}
          <QRScannerRectView
            maskColor={this.props.maskColor}
            cornerColor={this.props.cornerColor}
            borderColor={this.props.borderColor}
            rectHeight={this.props.rectHeight}
            rectWidth={this.props.rectWidth}
            borderWidth={this.props.borderWidth}
            cornerBorderWidth={this.props.cornerBorderWidth}
            cornerBorderLength={this.props.cornerBorderLength}
            isLoading={this.props.isLoading}
            cornerOffsetSize={this.props.cornerOffsetSize}
            isCornerOffset={this.props.isCornerOffset}
            bottomMenuHeight={this.props.bottomMenuHeight}
            scanBarAnimateTime={this.props.scanBarAnimateTime}
            scanBarColor={this.props.scanBarColor}
            scanBarHeight={this.props.scanBarHeight}
            scanBarMargin={this.props.scanBarMargin}
            hintText={this.props.hintText}
            viewfinder={this.props.viewfinder}
            hintTextStyle={this.props.hintTextStyle}
            scanBarImage={this.props.scanBarImage}
            hintTextPosition={this.props.hintTextPosition}
            isShowScanBar={this.props.isShowScanBar}
          />

          {/* 绘制底部操作栏 */}
          <View style={[styles.buttonsContainer, this.props.bottomMenuStyle]}>
            {this.props.renderBottomMenuView()}
          </View>

        </Camera>
      </View>
    )
  }
}
