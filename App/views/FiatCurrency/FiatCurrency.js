import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import FiatCurrencyFast from './FiatCurrencyFast';
import FiatCurrencyHeader from './FiatCurrencyHeader';
import {
  updateForm,
  clearForm,
  requestLegalMarketTokens,
} from './redux/action/FiatCurrency';
import FiatCurrencyList from './FiatCurrencyList';
import {queryConfigUserSettings} from '../../redux/actions/user';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
  },
  right_bg: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 0.5,
    height: 32,
    borderRadius: 16,
    marginRight: common.margin10,
  },
  right_selected: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: common.margin10,
    borderRadius: 16,
    backgroundColor: common.themeColor,
  },
  right_nomal: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: common.margin10,
    borderRadius: 16,
  },
  right_text: {
    fontSize: common.font14,
    textAlign: 'center',
    color: 'white',
  },
  right_text_selected: {
    fontSize: common.font14,
    textAlign: 'center',
    color: common.blackColor,
  },
});

class FiatCurrency extends React.Component {
  static navigationOptions = props => {
    const {params} = props.navigation.state;
    const selectType = params ? params.selectType : 1;
    const onPress = params ? params.onPress : undefined;
    return {
      headerRight: (
        <View style={styles.right_bg}>
          <TouchableWithoutFeedback
            onPress={() => {
              onPress(0);
            }}>
            <View
              style={
                selectType == 0 ? styles.right_selected : styles.right_nomal
              }>
              <Text
                style={
                  selectType == 0
                    ? styles.right_text_selected
                    : styles.right_text
                }>
                快捷区
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              onPress(1);
            }}>
            <View
              style={
                selectType == 1 ? styles.right_selected : styles.right_nomal
              }>
              <Text
                style={
                  selectType == 1
                    ? styles.right_text_selected
                    : styles.right_text
                }>
                自选区
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      ),
    };
  };

  componentDidMount() {
    const {dispatch} = this.props;
    this.setType(1);
    dispatch(
      requestLegalMarketTokens({
        action: 'tokens',
        skip: 0,
        limit: 500,
      }),
    );
    dispatch(queryConfigUserSettings({keys: ['LegalPayType']}));
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch(clearForm());
  }

  setType(index) {
    const {navigation, dispatch} = this.props;
    navigation.setParams({
      selectType: index,
      onPress: this.onPress,
    });
    dispatch(
      updateForm({
        selectType: index,
      }),
    );
  }

  onPress = index => {
    this.setType(index);
  };

  render() {
    const {selectType} = this.props.form;
    return (
      <View style={styles.container}>
        <FiatCurrencyHeader />
        {selectType == 0 ? <FiatCurrencyFast /> : <FiatCurrencyList />}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.FiatCurrency,
  };
}

export default connect(mapStateToProps)(FiatCurrency);
