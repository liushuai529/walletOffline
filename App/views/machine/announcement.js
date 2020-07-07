import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ImageBackground,
} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import transfer from '../../localization/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: common.bgColor,
  },
});

class Announcement extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: transfer(props.screenProps.language, 'announcement01'),
    };
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const content = this.props.navigation.state.params.content;
    return (
      <ImageBackground
        style={styles.container}
        resizeMode="cover"
        source={require('../../resource/assets/nomal_bg.png')}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <Text
            style={{
              fontSize: common.font16,
              color: common.navTitleColor,
              margin: common.margin20,
              lineHeight: common.font25,
            }}>
            {content}
          </Text>
        </ScrollView>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.system,
  };
}

export default connect(mapStateToProps)(Announcement);
