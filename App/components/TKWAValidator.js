var WAValidator = require('wallet-address-validator');

const orginCoins = [
'btc',
'bch',
'ltc',
'ppc',
'doge',
'bvc',
'frc',
'pts',
'mec',
'xpm',
'aur',
'nmc',
'bio',
'grlc',
'vtc',
'btg',
'kmd',
'btcz',
'btcp',
'hush',
'sng',
'zec',
'zcl',
'zen',
'vot',
'dcr',
'dgb',
'eth',
'etz',
'etc',
'clo',
'xrp',
'dash',
'neo',
'gas',
'ont',
'gas',
'qtum',
'usdt'
]

function validate(address, currencyNameOrSymbol, networkType) {
	let validateCurrency = currencyNameOrSymbol.toLowerCase()
	if (!orginCoins.includes(validateCurrency)) {
		return true;
	}

	const result = WAValidator.validate(address, validateCurrency, networkType)

	return result
}

export default {
	validate,
}
