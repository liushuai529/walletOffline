import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import {changeLanuage, reloadLanuageTransfer} from '../../redux/actions/system';
import transfer from '../../localization/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item_bottom_line: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#EBEBEB',
    position: 'absolute',
    bottom: 0,
  },
});

class Language extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: transfer(props.language, 'language'),
    };
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  renderItem(item, index) {
    const {languageIndex, dispatch} = this.props;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (languageIndex != index) {
            dispatch(changeLanuage(index));
            dispatch(reloadLanuageTransfer());
          }
        }}>
        <View
          style={{
            width: '100%',
            height: common.h50,
            paddingHorizontal: common.margin15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: common.font14, color: '#787878'}}>
            {item.key}
          </Text>
          {languageIndex == index ? (
            <Image
              style={{
                width: common.w20,
                height: common.w20,
                tintColor: '#787878',
              }}
              source={require('../../resource/assets/check_box.png')}
              resizeMode="contain"
            />
          ) : null}
          <View style={styles.item_bottom_line}></View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={[{key: '简体中文'}, {key: '繁體中文'}, {key: 'English'}]}
          renderItem={({item, index}) => this.renderItem(item, index)}
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

export default connect(mapStateToProps)(Language);
