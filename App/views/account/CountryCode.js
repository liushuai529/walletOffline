import {connect} from 'react-redux';
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  ImageBackground,
  FlatList,
  Image,
} from 'react-native';
import transfer from '../../localization/utils';
import {common} from '../../constants/common';
import {changeCountry} from '../../redux/actions/country_code';

class CountryCode extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: transfer(props.screenProps.language, 'choose_country'),
    };
  };

  renderItem(item, index) {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.dispatch(changeCountry(index));
          this.props.navigation.goBack();
        }}>
        <View style={{height: common.h44}}>
          <View
            style={{
              padding: common.margin10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.item}>
                {item.names[this.props.languageIndex]}
              </Text>
              <Text style={[styles.item, {marginLeft: common.margin5}]}>{`(+${
                item.code
              })`}</Text>
            </View>
            <View style={{padding: common.margin10}}>
              {this.props.country_index == index ? (
                <Image
                  style={{width: common.h15, height: common.h15}}
                  source={require('../../resource/assets/check_box.png')}
                />
              ) : null}
            </View>
          </View>
          <View
            style={{
              width: '100%',
              height: 0.5,
              backgroundColor: common.placeholderColor,
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    return (
      <ImageBackground
        style={styles.container}
        source={require('../../resource/assets/nomal_bg.png')}>
        <FlatList
          data={this.props.country_data}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => {
            return <View style={{width: '100%', height: common.h15}} />;
          }}
          renderItem={({item, index}) => this.renderItem(item, index)}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
  },
  item: {
    fontSize: 18,
    color: common.navTitleColor,
  },
});

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.country_code,
  };
}

export default connect(mapStateToProps)(CountryCode);
