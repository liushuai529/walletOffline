//
//  CreateWallet.m
//  tok
//
//  Created by 刘帅 on 2020/6/22.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#include "TWHDWallet.h"
#include "TWStoredKey.h"
#include "TWEthereumProto.h"

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import "CreateWallet.h"
#import "TWBitcoinAddress.h"
#import "TWPublicKeyType.h"
#import "TWBitcoinProto.h"
#import "TWAnySigner.h"

         
#include <stdio.h>
#include "TWFoundationString.h"
#include "TWFoundationData.h"




#import <objc/message.h>
#import <React/RCTConvert.h>
 
@implementation CreateWallet


RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(HDWalletIsValid:(NSString *)mnemonic callback:(RCTResponseSenderBlock)callback)
{
  bool result = TWHDWalletIsValid([self NSStringToTWString:mnemonic]);
  if(result) {
    callback(@[[NSNull null]]);
  } else {
    callback(@[@"error"]);
  }
}

RCT_EXPORT_METHOD(getStoreKey:(NSString *)mnemonic :(NSString *) priKey :(RCTResponseSenderBlock)callback)
{
//  TWStoredKey* storyKey = TWStoredKeyImportHDWallet([self NSStringToTWString:mnemonic],
//    [self NSStringToTWString:@"tokWallet"], [self NSStringToTWData:@"tokWallet"], TWCoinTypeBitcoin);
//  NSString* storyKey_json = [self TWDataToNSString:TWStoredKeyExportJSON(storyKey)];
  
    
//  extern TWString *_Nonnull TWAnySignerSignJSON(TWString *_Nonnull json, TWData *_Nonnull key, enum TWCoinType coin);
  
  
    NSMutableDictionary *keyInfoDict = [[NSMutableDictionary alloc] init];
  
    NSString * aaaa= @"01";
 
  
    [keyInfoDict setObject:[self NSStringToNSData:aaaa] forKey:@"chainID"];
//    [keyInfoDict setObject:@"09" forKey:@"nonce"];
//    [keyInfoDict setObject:@"04a817c800" forKey:@"gasPrice"];
//    [keyInfoDict setObject:@"5208" forKey:@"gasLimit"];
//    [keyInfoDict setObject:@"0x3535353535353535353535353535353535353535" forKey:@"toAddress"];
//    [keyInfoDict setObject:@"0de0b6b3a7640000" forKey:@"amount"];
//    [keyInfoDict setObject:@"0x4646464646464646464646464646464646464646464646464646464646464646" forKey:@"privateKey"];
  

  
  
  
    NSData *data=[NSJSONSerialization dataWithJSONObject:keyInfoDict options:NSJSONWritingPrettyPrinted error:nil];
  
  
  
    NSString *str=[[NSString alloc]initWithData:data encoding:NSUTF8StringEncoding];
    TWString *a = TWAnySignerSign([self NSStringToTWData:aaaa], TWCoinTypeEthereum);

  

}




- (NSData *)NSStringToNSData:(NSString *)arg
{
  return [arg dataUsingEncoding:NSUTF8StringEncoding];
}



- (TWString *)NSStringToTWString:(NSString *)arg
{
  char *arg_char = (char*) [arg cStringUsingEncoding:NSUTF8StringEncoding];
  return TWStringCreateWithUTF8Bytes(arg_char);
}

- (NSString *)TWStringToNSString:(TWString *)arg
{
  const char* arg_char = TWStringUTF8Bytes(arg);
  return [NSString stringWithFormat:@"%s", arg_char];
}

- (NSString *)TWDataToNSString:(TWData *)arg
{
  TWString* arg_twString = TWStringCreateWithHexData(arg);
  const char* arg_char = TWStringUTF8Bytes(arg_twString);
  return [NSString stringWithFormat:@"%s",arg_char];
}

- (TWData *)NSStringToTWData:(NSString *)arg
{
  char *arg_char = (char*) [arg cStringUsingEncoding:NSUTF8StringEncoding];
  return TWDataCreateWithHexString(TWStringCreateWithUTF8Bytes(arg_char));
}


- (NSMutableDictionary *)getWalletInfo:(int)type :(NSArray *)array :(NSString *)mnemonic
{
  TWHDWallet* hdWallet;
  if(type == 0) {
    hdWallet = TWHDWalletCreate(128, [self NSStringToTWString:@""]);
  } else {
    hdWallet = TWHDWalletCreateWithMnemonic([self NSStringToTWString:mnemonic], [self NSStringToTWString:@""]);
  }
  //助记词
  NSString* mnemic = [self TWStringToNSString:TWHDWalletMnemonic(hdWallet)];
  NSLog(@"助记词%@", mnemic);

  //种子
  TWData* seedData = TWHDWalletSeed(hdWallet);
  NSString* seed = [self TWDataToNSString:seedData];
  NSLog(@"种子%@", seed);

  //rootKey
  TWPrivateKey* priRootKey = TWHDWalletGetMasterKey(hdWallet, TWCurveSECP256k1);
  TWData* priRootKey_twdata = TWPrivateKeyData(priRootKey);
  NSString* result_priRootKey = [self TWDataToNSString:priRootKey_twdata];
  NSLog(@"root私钥%@", result_priRootKey);


  //定义币种键值对
  NSMutableArray *coinArray = [[NSMutableArray alloc] init];

  for (int i = 0; i < array.count; i++) {
    NSDictionary *obj = array[i];
    NSString *coinType = [RCTConvert NSString:obj[@"name"]];
    enum TWCoinType coinEnum = TWCoinTypeBitcoin;
    if([coinType isEqualToString:@"BTC"]) {
      coinEnum = TWCoinTypeBitcoin;
    }
    if([coinType isEqualToString:@"ETH"]) {
      coinEnum = TWCoinTypeEthereum;
    }

    //币种私钥
    TWPrivateKey* priKey = TWHDWalletGetKeyForCoin(hdWallet, coinEnum);
    TWData* priKey_twdata = TWPrivateKeyData(priKey);
    NSString* result_priKey = [self TWDataToNSString:priKey_twdata];
    NSLog(@"私钥%@", result_priKey);

    //币种公钥
    TWPublicKey* pubKey;
    if([coinType isEqualToString:@"BTC"]) {
      pubKey = TWPrivateKeyGetPublicKeySecp256k1(priKey, true);
    } else {
      pubKey = TWPrivateKeyGetPublicKeySecp256k1(priKey, false);
    }
    TWData* pubKey_TWdata = TWPublicKeyData(pubKey);
    NSString* result_pubKey = [self TWDataToNSString:pubKey_TWdata];
    NSLog(@"公钥%@", result_pubKey);



    //扩展公钥与私钥
    TWString* extendPriKey = TWHDWalletGetExtendedPrivateKey(hdWallet, TWPurposeBIP44, coinEnum, TWHDVersionXPRV);
    NSString* result_extendPriKey = [self TWStringToNSString:extendPriKey];
    NSLog(@"扩展私钥%@", result_extendPriKey);


    TWString* extendPubKey = TWHDWalletGetExtendedPublicKey(hdWallet, TWPurposeBIP44, coinEnum, TWHDVersionXPUB);
    NSString* result_extendPubKey = [self TWStringToNSString:extendPubKey];
    NSLog(@"扩展公钥%@", result_extendPubKey);


    TWString* TWaddress = TWHDWalletGetAddressForCoin(hdWallet, coinEnum);
    NSString *result_address = [self TWStringToNSString:TWaddress];
    NSLog(@"地址%@", result_address);

    NSMutableDictionary *keyInfoDict = [[NSMutableDictionary alloc] init];
    [keyInfoDict setObject:coinType forKey:@"coinType"];
    [keyInfoDict setObject:result_extendPriKey forKey:@"priKey"];
    [keyInfoDict setObject:result_extendPubKey forKey:@"pubKey"];
    [keyInfoDict setObject:result_address forKey:@"address"];
    [coinArray addObject:keyInfoDict];
  }
  NSMutableDictionary *walletInfoDict = [[NSMutableDictionary alloc] init];
  [walletInfoDict setObject:seed forKey:@"seed"];
  [walletInfoDict setObject:coinArray forKey:@"coinArray"];
  if(type == 0) {
    [walletInfoDict setObject:mnemic forKey:@"mnemic"];
  } else {
    [walletInfoDict setObject:mnemonic forKey:@"mnemic"];
  }

  return walletInfoDict;
}


RCT_EXPORT_METHOD(importMnemonic:(NSArray *)array mnemonic:(NSString *)mnemonic callback:(RCTResponseSenderBlock)callback)
{
  NSMutableDictionary *walletInfoDict = [[NSMutableDictionary alloc] init];
  walletInfoDict = [self getWalletInfo:1 :array :mnemonic];
  if(walletInfoDict.count == 3 && walletInfoDict[@"mnemic"] && walletInfoDict[@"seed"] && walletInfoDict[@"coinArray"]) {
    callback(@[[NSNull null], walletInfoDict]);
  } else {
    callback(@[@"error"]);
  }
}

RCT_EXPORT_METHOD(createMnemonic:(NSArray *)array callback:(RCTResponseSenderBlock)callback)
{
  NSMutableDictionary *walletInfoDict = [[NSMutableDictionary alloc] init];
  walletInfoDict = [self getWalletInfo:0 :array :@""];
  if(walletInfoDict.count == 3 && walletInfoDict[@"mnemic"] && walletInfoDict[@"seed"] && walletInfoDict[@"coinArray"]) {
    callback(@[[NSNull null], walletInfoDict]);
  } else {
    callback(@[@"error"]);
  }
}



RCT_EXPORT_METHOD(createAddress:(RCTResponseSenderBlock)callback )
{

}




- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}


@end

