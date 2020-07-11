const initialState = {
  coinArray: [],
  mnemonic: '',
  seed: '',
  coinInfoArray: [],
  operationType: 0,
  isLogin: false,
  signerCoinType: '',
}

export default function wallet(state = initialState, action) {
  const { type, payload } = action
  let nextState
  switch (type) {
    case 'wallet/update_coin_array':
      nextState = {
        ...state,
        coinArray: payload,
      }
      break
    case 'wallet/update_mnemonic':
      nextState = {
        ...state,
        mnemonic: payload,
      }
      break
    case 'wallet/update_seed':
      nextState = {
        ...state,
        seed: payload,
      }
      break
    case 'wallet/update_coin_info_array':
      nextState = {
        ...state,
        coinInfoArray: payload,
      }
      break
    case 'wallet/update_operation_type':
      nextState = {
        ...state,
        operationType: payload,
      }
      break

    case 'wallet/create_wallet':
      nextState = {
        ...state,
        isLogin: true,
      }
      break

    case 'wallet/signer_coin_type':
      nextState = {
        ...state,
        signerCoinType: payload,
      }
      break
    default:
      nextState = state
      break
  }
  return nextState
}
