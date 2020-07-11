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
    
    let wallet = HDWallet(mnemonic: signerDic["mnemonic"] as! String, passphrase: "")
    print("地址", wallet.getAddressForCoin(coin: .ethereum))
    let nonce = signerDic["nonce"]
    let gasPrice = signerDic["gasPrice"]
    let gasLimit = signerDic["gasLimit"]
    let toAddress = signerDic["to"] as! String
    let amount = signerDic["amount"]

    let input = EthereumSigningInput.with {
      $0.chainID = Data(hexString:"01")!
//      $0.nonce = nonce as! Data
//      $0.gasPrice = gasPrice as! Data
//      $0.gasLimit = gasLimit as! Data
//      $0.toAddress = toAddress
//      $0.amount = amount as! Data
      
      
      $0.gasPrice = Data(hexString: "d693a400")! // decimal 3600000000
      $0.gasLimit = Data(hexString: "5208")! // decimal 21000
      $0.toAddress = "0xC37054b3b48C3317082E7ba872d7753D13da4986"
      $0.amount = Data(hexString: "0348bca5a16000")!
      $0.privateKey = wallet.getKeyForCoin(coin: .ethereum).data
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
