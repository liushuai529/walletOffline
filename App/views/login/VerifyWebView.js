import React, { Component } from "react";
import { View, StyleSheet, Image } from "react-native";
import { WebView } from "react-native-webview";
import { connect } from "react-redux";
import { common } from "../../constants/common";
import * as api from "../../services/api";

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: common.h60,
        marginBottom: common.margin40
    }
});

class VerifyWebView extends Component {
    onMessage(e) {
        var data = e.nativeEvent.data;
        var result = undefined;
        if (data.length > 0) {
            result = JSON.parse(decodeURIComponent(decodeURIComponent(data)));
        }
        const { callback } = this.props;
        if (callback) {
            callback(result);
        }
    }

    render() {
        const { language } = this.props;
        let lan = "en";
        if (language == "zh_hant") {
            lan = "tw";
        } else if (language == "zh_hans") {
            lan = "cn";
        }
        const uri = `${api.API_ROOT}/checkCapcha2.html?language=${lan}&timestamp=${new Date().getTime()}`;
        return (
            <View style={styles.container}>
                <WebView
                    ref={webview => (thisWebView = webview)}
                    style={{ flex: 1, backgroundColor: "transparent" }}
                    source={{ uri: uri }}
                    useWebKit={false}
                    javaScriptEnabled={true}
                    scalesPageToFit={true}
                    scrollEnabled={false}
                    onMessage={e => this.onMessage(e)}
                />
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
      ...state.system
    };
}

export default connect(mapStateToProps)(VerifyWebView);
