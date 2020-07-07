import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  StyleSheet,
  DeviceEventEmitter,
  ImageBackground,
} from 'react-native';
import {connect} from 'react-redux';
import {common} from '../../constants/common';
import {PopoverPicker} from 'teaset';
import {
  requestAllMyProducts,
  changeMyProductsIndex,
  requestUpdateProducts,
  changeUpdateProductsIndex,
  updateProduct,
  clearData,
} from '../../redux/actions/update_machine';
import {requestEstimate} from '../../redux/actions/buy_machine';
import {requesetUserAssets} from '../../redux/actions/user';
import BigNumber from 'bignumber.js';
import {Toast} from 'teaset';
import {USER_BUY_PRODUCTS_SUCCESS_KEY} from '../../constants/constant';
import Alert from '../../components/Alert';
import transfer from '../../localization/utils';

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: common.h60,
    paddingHorizontal: common.margin20,
  },
  item_left: {
    fontSize: common.font16,
    color: '#9C9C9C',
    minWidth: common.w150,
  },
  item_right: {
    fontSize: common.font16,
    color: '#9C9C9C',
    flex: 1,
  },
  select: {
    flex: 1,
    borderColor: common.textColor,
    borderWidth: 1,
    borderRadius: common.h5 / 2,
    flexDirection: 'row',
    height: common.h36,
    justifyContent: 'space-between',
  },
  select_text: {
    color: '#9C9C9C',
    fontSize: common.font14,
    marginVertical: common.margin8,
    marginRight: common.margin15,
    marginHorizontal: common.margin10,
    flex: 1,
  },
  btn_container: {
    paddingVertical: common.margin20,
    paddingHorizontal: common.margin20,
  },
  btn_inside: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: common.margin15,
  },
  btn_text: {
    color: common.textColor,
    fontSize: common.font16,
  },
  select_image: {
    width: common.h10,
    height: common.h10,
    alignSelf: 'center',
    marginRight: common.margin10,
    tintColor: common.themeColor,
  },
});

class UpdateMachine extends React.Component {
  static navigationOptions = (props, navigation) => {
    return {
      headerTitle: transfer(props.screenProps.language, 'update_machine01'),
    };
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {dispatch} = this.props;
    dispatch(clearData());
  }

  componentDidMount() {
    const {dispatch, navigation} = this.props;
    dispatch(
      requestAllMyProducts({
        skip: 0,
        limit: 500,
        orderby: 'id',
      }),
    );
    dispatch(requesetUserAssets({token_ids: ['*']}));
    this.uiListener = DeviceEventEmitter.addListener(
      USER_BUY_PRODUCTS_SUCCESS_KEY,
      item => {
        navigation.goBack();
      },
    );
  }

  componentWillUnmount() {
    this.uiListener.remove();
  }

  showView(view) {
    let names = [];
    this.props.allMyProducts.forEach(item => {
      const name = this.props.allProductsNameDic[item.prod_id];
      names.push(name);
    });
    if (names.length == 0) {
      Toast.fail(transfer(this.props.language, 'update_machine02'));
      return;
    }
    view.measure((x, y, width, height, pageX, pageY) => {
      PopoverPicker.show(
        {x: pageX, y: pageY, width, height},
        names,
        this.props.selectMyProductsIndex,
        (item, index) =>
          setTimeout(() => {
            this.props.dispatch(changeMyProductsIndex(index));
            this.props.dispatch(
              requestUpdateProducts({
                skip: 0,
                limit: 500,
                orderby: 'id',
                where: {
                  mine_base: {
                    gt: this.props.selectMyProduct.mine_base,
                  },
                  status: 'allow',
                },
              }),
            );
          }, 300),
        {modal: false},
      );
    });
  }

  showUpdateView(view) {
    const {selectMyProduct} = this.props;
    if (!selectMyProduct) {
      Toast.fail(transfer(this.props.language, 'update_machine03'));
      return;
    }
    if (this.props.updateProductsName.length == 0) {
      Toast.fail(transfer(this.props.language, 'update_machine04'));
      return;
    }
    view.measure((x, y, width, height, pageX, pageY) => {
      PopoverPicker.show(
        {x: pageX, y: pageY, width, height},
        this.props.updateProductsName,
        this.props.selectUpdateProductsIndex,
        (item, index) =>
          setTimeout(() => {
            this.props.dispatch(changeUpdateProductsIndex(index));
            this.props.dispatch(
              requestEstimate({
                buy_prices: [
                  this.props.selectMyProduct.buy_price,
                  this.props.selectUpdateProduct.buy_price,
                ],
                check_asset: 'no',
              }),
            );
          }, 300),
        {modal: false},
      );
    });
  }

  buyAction() {
    const {dispatch, selectMyProduct, selectUpdateProduct} = this.props;
    if (!selectMyProduct) {
      Toast.fail(transfer(this.props.language, 'update_machine05'));
      return;
    }
    if (!selectUpdateProduct) {
      Toast.fail(transfer(this.props.language, 'update_machine06'));
      return;
    }
    Alert.alert(
      `${transfer(this.props.language, 'update_machine07')}？`,
      '',
      [
        {
          text: transfer(this.props.language, 'update_machine08'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: transfer(this.props.language, 'update_machine09'),
          onPress: () => {
            dispatch(
              updateProduct({
                from_prod_id: selectMyProduct.prod_id,
                to_prod_id: selectUpdateProduct.id,
              }),
            );
          },
        },
      ],
      {cancelable: false},
    );
  }

  render() {
    const {
      selectMyProduct,
      assets,
      estimate,
      allProductsNameDic,
      selectUpdateProductsIndex,
      selectUpdateProduct,
      allProductsDic,
    } = this.props;
    const price =
      selectMyProduct && estimate
        ? estimate[selectMyProduct.buy_price]
        : undefined;
    let price1, price2, price3, price4, price5;
    if (selectMyProduct && selectUpdateProduct) {
      const product = allProductsDic[selectMyProduct.prod_id];
      price1 = `${common.removeInvalidZero(
        BigNumber(selectUpdateProduct.fixed_rate)
          .minus(product.fixed_rate)
          .multipliedBy(100)
          .toFixed(8, 1),
      )}%`;
      price2 = common.removeInvalidZero(
        BigNumber(selectUpdateProduct.outof_multipe)
          .minus(product.outof_multipe)
          .toFixed(8, 1),
      );
      price3 = common.removeInvalidZero(
        BigNumber(selectUpdateProduct.buy_price)
          .minus(product.buy_price)
          .toFixed(8, 1),
      );
      const estimate1 = estimate
        ? estimate[selectUpdateProduct.buy_price]
        : undefined;
      const estimate2 = estimate ? estimate[product.buy_price] : undefined;
      if (estimate1 && estimate2) {
        price4 = common.removeInvalidZero(
          BigNumber(estimate1.bonus)
            .minus(estimate2.bonus)
            .toFixed(8, 1),
        );
        price5 = common.removeInvalidZero(
          BigNumber(estimate1.profit)
            .minus(estimate2.profit)
            .toFixed(8, 1),
        );
      }
    }
    return (
      <ImageBackground
        style={{flex: 1, backgroundColor: common.bgColor}}
        source={require('../../resource/assets/nomal_bg.png')}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.item, {marginTop: common.margin10}]}>
            <Text style={[styles.item_left, {minWidth: common.w120}]}>
              {transfer(this.props.language, 'update_machine10')}：
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                this.showView(this.fromView);
              }}>
              <View
                ref={view => {
                  this.fromView = view;
                }}
                style={styles.select}>
                <Text style={styles.select_text}>
                  {selectMyProduct
                    ? allProductsNameDic[selectMyProduct.prod_id]
                    : transfer(this.props.language, 'update_machine11')}
                </Text>
                <Image
                  style={styles.select_image}
                  source={require('../../resource/assets/down.png')}
                  resizeMode="contain"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.item}>
            <Text style={[styles.item_left, {minWidth: common.w120}]}>
              {transfer(this.props.language, 'update_machine12')}：
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                this.showUpdateView(this.fromView2);
              }}>
              <View
                ref={view => {
                  this.fromView2 = view;
                }}
                style={styles.select}>
                <Text style={styles.select_text}>
                  {selectUpdateProduct
                    ? selectUpdateProduct.name
                    : transfer(this.props.language, 'update_machine13')}
                </Text>
                <Image
                  style={styles.select_image}
                  source={require('../../resource/assets/down.png')}
                  resizeMode="contain"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.item}>
            <Text style={styles.item_left}>
              {transfer(this.props.language, 'update_machine14')}：
            </Text>
            <Text style={styles.item_right}>{price1 ? price1 : ''}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.item_left}>
              {transfer(this.props.language, 'update_machine15')}：
            </Text>
            <Text style={styles.item_right}>{price2 ? price2 : ''}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.item_left}>
              {transfer(this.props.language, 'update_machine16')}：
            </Text>
            <Text style={styles.item_right}>{price3 ? price3 : ''}</Text>
          </View>
          <View style={[styles.item, {height: common.h100}]}>
            <Text style={styles.item_left}>
              {transfer(this.props.language, 'update_machine17')}：
            </Text>
            <Text style={styles.item_right}>
              {price4 && price5 ? `\nATV:${price4}\n\nTV:${price5}\n` : ''}
            </Text>
          </View>
          <View style={[styles.item]}>
            <Text style={styles.item_left}>
              {transfer(this.props.language, 'update_machine18')}：
            </Text>
            <Text style={styles.item_right}>
              {assets && assets.revenue && assets.revenue.bonus
                ? common.removeInvalidZero(
                    BigNumber(assets.revenue.bonus).toFixed(8, 1),
                  )
                : '0'}
            </Text>
          </View>
          <View style={[styles.item, {marginBottom: common.margin20}]}>
            <Text style={styles.item_left}>
              {transfer(this.props.language, 'update_machine19')}：
            </Text>
            <Text style={styles.item_right}>
              {assets && assets.revenue && assets.revenue.profit
                ? common.removeInvalidZero(
                    BigNumber(assets.revenue.profit).toFixed(8, 1),
                  )
                : '0'}
            </Text>
          </View>
        </ScrollView>
        <View style={styles.btn_container}>
          <ImageBackground
            style={{padding: 0}}
            resizeMode="cover"
            source={require('../../resource/assets/login_btn.png')}>
            <TouchableWithoutFeedback onPress={() => this.buyAction()}>
              <View style={styles.btn_inside}>
                <Text style={styles.btn_text}>
                  {transfer(this.props.language, 'update_machine20')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </ImageBackground>
        </View>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.system,
    ...state.update_machine,
    assets: state.user.assets,
    allProductsNameDic: state.buy_machine.allProductsNameDic,
    estimate: state.buy_machine.estimate,
    allProductsDic: state.buy_machine.allProductsDic,
  };
}

export default connect(mapStateToProps)(UpdateMachine);
