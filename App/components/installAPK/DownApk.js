import React, {Component} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, AppState} from 'react-native';
import {common} from '../../constants/common';
import DownItem from './DownItem';
import {_downloadFileApk} from './downloadFile';
import ApkInstaller from 'react-native-apk-install';
import RNFS from 'react-native-fs';

const styles = StyleSheet.create({
  headerLeft: {
    height: common.w40,
    width: common.w40,
    justifyContent: 'center',
  },
  headerLeftImge: {
    marginLeft: common.margin10,
    width: common.w10,
    height: common.h20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topCell: {
    marginTop: common.margin10,
  },
});

class DownApk extends Component {
  static navigationOptions(props) {
    let title = 'App下载';
    return {
      headerTitle: title,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      attachmentItem: {
        progress: 0,
        isDownLoad: false,
        isFaild: false,
        name: 'Tok下载',
        url: 'https://gbcappdownload.oss-accelerate.aliyuncs.com/tvm.apk',
      },
    };
  }
  handleDownLoadFile = () => {
    this.downLoadFile();
  };

  componentDidMount() {
    this.handleDownLoadFile();
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    this.onLine = nextAppState;
  };

  downLoadFile = () => {
    const {onComplete, onError} = this.props;
    const ExternalDirectoryPath = RNFS.ExternalDirectoryPath;

    const toLoadPath = `${ExternalDirectoryPath}/tv.apk`;
    _downloadFileApk(
      `${this.state.attachmentItem.url}`,
      complete => {
        if (complete) {
          this.setState({
            attachmentItem: {
              progress: 100,
              isDownLoad: false,
              isFaild: false,
            },
          });
          if (this.onLine === undefined) {
						ApkInstaller.install(toLoadPath);
            onComplete();
          } else if (this.onLine !== 'active') {
						ApkInstaller.install(toLoadPath);
            onComplete();
					}else {
						ApkInstaller.install(toLoadPath);
						onComplete();
					}
        } else {
          onError();
        }
      },
      begin => {
        if (begin.statusCode === 200) {
          this.setState({
            attachmentItem: {
              progress: 0,
              isDownLoad: true,
              isFaild: false,
            },
          });
        } else {
          onError();
        }
      },
      progress => {
        if (progress) {
          if (progress.contentLength && progress.bytesWritten) {
            this.setState({
              attachmentItem: {
                progress: parseInt((progress.bytesWritten / progress.contentLength).toFixed(2) * 100),
                isDownLoad: true,
                isFaild: false,
                name: 'Tok下载',
              },
            });
          }
        }
      },
    );
  };

  render() {
    const {attachmentItem} = this.state;
    const {language} = this.props;
    return (
      <View style={styles.container}>
        <DownItem attachmentItem={attachmentItem} handleDownLoadFile={this.handleDownLoadFile} language={language} />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.system.language,
  };
}

export default connect(mapStateToProps)(DownApk);
