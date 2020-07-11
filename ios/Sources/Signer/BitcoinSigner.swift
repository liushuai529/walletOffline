// Copyright © 2017-2020 Trust Wallet.
//
// This file is part of Trust. The full Trust copyright notice, including
// terms governing use, modification, and redistribution, is contained in the
// file LICENSE at the root of the source code distribution tree.


@objc(BitcoinSigner)

class BitcoinSigner: NSObject {
  
  @objc
  func btcSign(signerDic: NSDictionary, _ callback: RCTResponseSenderBlock) ->Void {
     
    let wallet = HDWallet(mnemonic: signerDic["mnemonic"] as! String, passphrase: "")
    let privateKey = wallet.getKeyForCoin(coin: .bitcoin)
    let utxoTxId = Data(hexString: "5e03cbb607a4c11fa3e58ba25738d2a142f34a754b74cf096608dd497615c53f")!

    let address = CoinType.bitcoin.deriveAddress(privateKey: privateKey)

    let utxo = BitcoinUnspentTransaction.with {
        $0.outPoint.hash = Data(utxoTxId.reversed()) // reverse of UTXO tx id, Bitcoin internal expects network byte order
        $0.outPoint.index = 2                      // outpoint index of this this UTXO, "vout" field from blockbook utxo api
        $0.outPoint.sequence = UINT32_MAX
        $0.amount = 1989                            // value of this UTXO, "value" field from blockbook utxo api
        $0.script = BitcoinScript.buildForAddress(address: address, coin: .bitcoin).data // Build lock script from address or public key hash
    }

    let input = BitcoinSigningInput.with {
        $0.hashType = BitcoinSigHashType.all.rawValue | BitcoinSigHashType.fork.rawValue
        $0.amount = 198
        $0.byteFee = 1
        $0.toAddress = "1LbEAQDDT6vCPcnftn8dQaCxUpcxkBwLQG"
        $0.changeAddress = "bc1qh8mw6dl6gcymf07vxqqd2m5ugrff0kajqraghg" // can be same sender address
        $0.utxo = [utxo]
        $0.privateKey = [privateKey.data]
//        $0.plan = BitcoinTransactionPlan.with {
//            $0.amount = 198
//            $0.fee = 6000
//            $0.utxos = [utxo]
//        }

    }
    let output: BitcoinSigningOutput = AnySigner.sign(input: input, coin: .bitcoin)

    print("签名输出", output.encoded.hexString)

    if(output.encoded.hexString.count>0) {
      callback([["error":"","out":output.encoded.hexString]])
    } else {
      callback([["error":"error","out":output.encoded.hexString]])
    }
    
  }
}
