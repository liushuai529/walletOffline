import React from 'react';
import { View, StyleSheet, Image, Text, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { common } from '../../constants/common';
import { updateForm } from './redux/action/FiatCurrency';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexDirection: 'row',
		backgroundColor: common.navBgColor,
		alignItems: 'flex-end',
		justifyContent: 'space-between',
		padding: common.margin15,
	},
	selected_text: {
		fontSize: common.font25,
		color: common.themeColor,
	},
	nomal_text: {
		fontSize: common.font18,
		color: 'white',
	},
});

class FiatCurrencyHeader extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {}

	componentWillUnmount() {}

	onPress(index) {
		const { dispatch } = this.props;
		dispatch(
			updateForm({
				operateType: index,
			})
		);
	}

	render() {
		const { operateType } = this.props.form;
		const { navigation } = this.props;
		return (
			<View style={styles.container}>
				<View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
					<TouchableWithoutFeedback
						onPress={() => {
							this.onPress(0);
						}}
					>
						<Text
							style={[
								operateType == 0 ? styles.selected_text : styles.nomal_text,
								{ paddingRight: common.margin15 },
							]}
						>
							我要买
						</Text>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback
						onPress={() => {
							this.onPress(1);
						}}
					>
						<Text style={operateType != 0 ? styles.selected_text : styles.nomal_text}>我要卖</Text>
					</TouchableWithoutFeedback>
				</View>
				<TouchableWithoutFeedback
					onPress={() => {
						navigation.navigate('OtcDetail');
					}}
				>
					<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
						<Image
							style={{ height: common.w20, width: common.w20, tintColor: 'white' }}
							source={require('../../resource/assets/order.png')}
						/>
						<Text style={{ fontSize: common.font14, color: 'white', marginLeft: common.margin5 }}>
							订单
						</Text>
					</View>
				</TouchableWithoutFeedback>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return {
		...state.FiatCurrency,
	};
}

export default connect(mapStateToProps)(withNavigation(FiatCurrencyHeader));
