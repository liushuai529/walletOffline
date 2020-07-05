// Copyright © 2017-2020 Trust Wallet.
//
// This file is part of Trust. The full Trust copyright notice, including
// terms governing use, modification, and redistribution, is contained in the
// file LICENSE at the root of the source code distribution tree.
//
// This is a GENERATED FILE, changes made here WILL BE LOST.
//

public enum HRP: UInt32, CaseIterable, CustomStringConvertible  {
    case unknown = 0
    case binance = 1
    case bitcoin = 2
    case bitcoinCash = 3
    case bitcoinGold = 4
    case cardano = 5
    case cosmos = 6
    case digiByte = 7
    case elrond = 8
    case groestlcoin = 9
    case harmony = 10
    case ioTeX = 11
    case kava = 12
    case litecoin = 13
    case monacoin = 14
    case qtum = 15
    case terra = 16
    case viacoin = 17
    case zilliqa = 18

    public var description: String {
        switch self {
        case .unknown: return ""
        case .binance: return "bnb"
        case .bitcoin: return "bc"
        case .bitcoinCash: return "bitcoincash"
        case .bitcoinGold: return "btg"
        case .cardano: return "addr"
        case .cosmos: return "cosmos"
        case .digiByte: return "dgb"
        case .elrond: return "erd"
        case .groestlcoin: return "grs"
        case .harmony: return "one"
        case .ioTeX: return "io"
        case .kava: return "kava"
        case .litecoin: return "ltc"
        case .monacoin: return "mona"
        case .qtum: return "qc"
        case .terra: return "terra"
        case .viacoin: return "via"
        case .zilliqa: return "zil"
        }
    }
}
