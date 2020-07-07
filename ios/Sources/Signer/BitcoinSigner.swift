// Copyright © 2017-2020 Trust Wallet.
//
// This file is part of Trust. The full Trust copyright notice, including
// terms governing use, modification, and redistribution, is contained in the
// file LICENSE at the root of the source code distribution tree.


@objc(BitcoinSigner)

class BitcoinSigner: NSObject {
  
  @objc
  func bitcoinSign(signerDic: NSDictionary, _ callback: RCTResponseSenderBlock) ->Void {
    
    let utxoTxId = signerDic["utxoTxId"] as! String
    let address = signerDic["address"] as! String
    let toAddress = signerDic["toAddress"] as! String
    let amount = signerDic["amount"] as! String
    let privateKey = signerDic["privateKey"] as! String
    let index = signerDic["index"] as! UInt32
    let vin = signerDic["vin"] as! NSArray
    
    var utxos = [Any]()
    
    for index in 0...vin.count-1 {
      
      
//      utxos.append(vin[index])
      
    }
    
    
    let utxo = BitcoinUnspentTransaction.with {
      $0.outPoint.hash =  Data(Data(hexString: utxoTxId)!.reversed()) // reverse of UTXO tx id, Bitcoin internal expects network byte order
      $0.outPoint.index = index                       // outpoint index of this this UTXO, "vout" field from blockbook utxo api
      $0.outPoint.sequence = UINT32_MAX
      $0.amount = 494000                             // value of this UTXO, "value" field from blockbook utxo api
      $0.script = BitcoinScript.buildForAddress(address: address, coin: .bitcoinCash).data // Build lock script from address or public key hash
    }
    
    let input = BitcoinSigningInput.with {
      $0.hashType = BitcoinSigHashType.all.rawValue | BitcoinSigHashType.fork.rawValue
      $0.amount = 488000
      $0.byteFee = 1
      $0.toAddress = toAddress
      $0.changeAddress = address // can be same sender address
      $0.utxo = [utxo]
      $0.privateKey = [Data(hexString: privateKey)!]
      //      $0.plan = BitcoinTransactionPlan.with {
      //        $0.amount = 488000
      //        $0.fee = 6000
      //        $0.change = 0
      //        // Sapling branch id
      ////        $0.branchID = Data(hexString: "0xbb09b876")!
      //        $0.utxos = [utxo]
      //      }
    }
    
    let output: BitcoinSigningOutput = AnySigner.sign(input: input, coin: .bitcoinCash)
    guard output.error.isEmpty else { return }
    // encoded transaction to broadcast
    print(output.encoded)
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    //    let data = Data(hexString: "ed00a0841cd53aedf89b0c616742d1d2a930f8ae2b0fb514765a17bb62c7521a")!
    //    let privateKey = PrivateKey(data: data)!
    //    let publicKey = privateKey.getPublicKeySecp256k1(compressed: true)
    //    let address = BitcoinAddress.compatibleAddress(publicKey: publicKey, prefix: CoinType.bitcoin.p2shPrefix)
    //
    //    print("address", address.description)
    //
    //    var input = BitcoinSigningInput.with {
    //      $0.hashType = BitcoinSigHashType.all.rawValue
    //      $0.amount = 1000
    //      $0.byteFee = 1
    //      $0.toAddress = "1Bp9U1ogV3A14FMvKbRJms7ctyso4Z4Tcx"
    //      $0.changeAddress = "1FQc5LdgGHMHEN9nwkjmz6tWkxhPpxBvBU"
    //    }
    //
    ////    input.privateKey.append(Data(hexString: "ed00a0841cd53aedf89b0c616742d1d2a930f8ae2b0fb514765a17bb62c7521a")!)
    //    //        input.privateKey.append(Data(hexString: "619c335025c7f4012e556c2a58b2506e30b8511b53ade95ea316fd8c3286feb9")!)
    //
    //    input.scripts["593128f9f90e38b706c18623151e37d2da05c229"] = Data(hexString: "2103596d3451025c19dbbdeb932d6bf8bfb4ad499b95b6f88db8899efac102e5fc71ac")!
    //
    //
    //    let p2sh = BitcoinScript.buildPayToWitnessScriptHash(scriptHash: Data(hexString: "ff25429251b5a84f452230a3c75fd886b7fc5a7865ce4a7bb7a9d7c5be6da3db")!)
    //    let utxo0 = BitcoinUnspentTransaction.with {
    //      $0.script = p2sh.data
    //      $0.amount = 1226
    //      $0.outPoint.hash = Data(hexString: "0001000000000000000000000000000000000000000000000000000000000000")!
    //      $0.outPoint.index = 0
    //      $0.outPoint.sequence = UInt32.max
    //    }
    //    input.utxo.append(utxo0)
    //
    ////    let plan: BitcoinTransactionPlan = AnySigner.plan(input: input, coin: .bitcoin)
    //
    //
    //    let output: BitcoinSigningOutput = AnySigner.sign(input: input, coin: .bitcoin)
    //
    ////    let txId = output.transactionID
    //
    //
    //
    //    let encoded = output.encoded.hexString
    //    print("btcout", encoded)
    
    
  }
}
