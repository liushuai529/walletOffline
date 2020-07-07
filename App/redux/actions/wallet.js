export function updateCoinArray(payload) {
  return {
    type: 'wallet/update_coin_array',
    payload,
  }
}

export function updateMnemonic(payload) {
  return {
    type: 'wallet/update_mnemonic',
    payload,
  }
}

export function updateSeed() {
  return {
    type: 'wallet/update_seed',
  }
}

export function updateCoinInfoArray(payload) {
  return {
    type: 'wallet/update_coin_info_array',
    payload,
  }
}

export function updateOperationType(payload) {
  return {
    type: 'wallet/update_operation_type',
    payload,
  }
}

export function createWallet() {
  return {
    type: 'wallet/create_wallet',
  }
}

