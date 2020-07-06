// Copyright © 2017-2020 Trust Wallet.
//
// This file is part of Trust. The full Trust copyright notice, including
// terms governing use, modification, and redistribution, is contained in the
// file LICENSE at the root of the source code distribution tree.

@objc(EthereumSigner)
public class EthereumSigner: NSObject{
  
//  @objc
  func testAddress() {
//    let anyAddress = AnyAddress(string: "0x7d8bf18c7ce84b3e175b339c4ca93aed1dd166f1", coin: .ethereum)
//
//    print(" addressRusult:", AnyAddress.isValid(string: "0x7d8bf18c7ce84b3e175b339c4ca93aed1dd166f1", coin: .ethereum))
//    let data = Data(hexString: "e12d35623961203963e2cbed0da62d48f24f6c4c5a1fe3983f5b8867de026568")!
    let data = Data(hexString: "0x9e6755dcee2c48661d1e226fb1c7739d901dbcb8af69959fabf9eb8f2a4516c2")!

    

    print(" priviteRusult:", PrivateKey.isValid(data: data, curve: .secp256k1))

  }
  @objc
  func ethsigner(signerDic: NSDictionary, _ callback: RCTResponseSenderBlock) ->Void {
    let chinID = signerDic["chinID"] as! String
    let nonce = signerDic["nonce"] as! String
    let gasPrice = signerDic["gasPrice"] as! String
    let gasLimit = signerDic["gasLimit"] as! String
    let toAddress = signerDic["toAddress"] as! String
    let amount = signerDic["amount"] as! String
    let privateKey = signerDic["privateKey"] as! String
    
    let input = EthereumSigningInput.with {
      $0.chainID = Data(hexString:chinID)!
      $0.nonce = Data(hexString: nonce)!
      $0.gasPrice = Data(hexString: gasPrice)!
      $0.gasLimit = Data(hexString: gasLimit)!
      $0.toAddress = toAddress
      $0.amount = Data(hexString: amount)!
      $0.privateKey = Data(hexString: privateKey)!
    }
    let output: EthereumSigningOutput = AnySigner.sign(input: input, coin: .ethereum)
    let encoded = AnySigner.encode(input: input, coin: .ethereum)
    print(" data:   ", output.encoded.hexString)
    if(output.encoded.hexString.count>0) {
      callback([["error":"","out":output.encoded.hexString]])
    } else {
      callback([["error":"error","out":output.encoded.hexString]])
    }
  }
  
  

  @objc
  public func test(name:String) -> Void {
     print(name)
   }
  
}
