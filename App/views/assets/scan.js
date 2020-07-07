import React from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import QRScannerView from '../../components/scan/QRScannerView';
import transfer from '../../localization/utils';
import TKWAValidator from '../../components/TKWAValidator';
import Alert from '../../components/Alert';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class Scan extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: transfer(props.screenProps.language, 'withdraw_scanTitle'),
      headerStyle: {
        backgroundColor: common.navBgColor,
        borderBottomWidth: 0,
        elevation: 0,
      },
    };
  };

  constructor(props) {
    super(props);
    this.didFindData = false;
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentWillReceiveProps(nextProps) {}

  barcodeReceived(barCode) {
    if (this.didFindData) {
      return;
    }
    const data = barCode.data;
    if (data && data.length > 0) {
      this.didFindData = true;
      const {navigation, language} = this.props;
      const {didScan} = navigation.state.params;
      var address = data;
      const disMatch = !TKWAValidator.validate(address, 'eth') && !TKWAValidator.validate(address, 'eth', 'testnet');

      if (disMatch) {
				this.didFindData = false;
        const params1 = transfer(language, 'withdrawal_address_correct_required_1');
        const params2 = transfer(language, 'withdrawal_address_correct_required_2');
        Alert.alert(transfer(language, 'withdraw_scanNote'), `${params1} USDT-ERC20 ${params2}`, [
          {
            text: transfer(language, 'alert_36'),
            onPress: () => {
              // navigation.goBack();
            },
          },
        ]);
        return;
      }
      if (didScan) {
        didScan(address);
      }
      navigation.goBack();
    }
  }

  render() {
    const {language} = this.props;
    return (
      <View style={styles.container}>
        <QRScannerView
          hintText={transfer(language, 'withdraw_takeBarcode')}
          onScanResultReceived={barCode => this.barcodeReceived(barCode)}
					renderTopBarView={() => null}
					renderBottomMenuView={() => null}
          rectHeight={262}
          rectWidth={262}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.system,
  };
}

export default connect(mapStateToProps)(Scan);
