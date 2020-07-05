// DO NOT EDIT.
// swift-format-ignore-file
//
// Generated by the Swift generator plugin for the protocol buffer compiler.
// Source: Ontology.proto
//
// For information on using the generated types, please see the documentation:
//   https://github.com/apple/swift-protobuf/

import Foundation
import SwiftProtobuf

// If the compiler emits an error on this type, it is because this file
// was generated by a version of the `protoc` Swift plug-in that is
// incompatible with the version of SwiftProtobuf to which you are linking.
// Please ensure that you are building against the same version of the API
// that was used to generate this file.
fileprivate struct _GeneratedWithProtocGenSwiftVersion: SwiftProtobuf.ProtobufAPIVersionCheck {
  struct _2: SwiftProtobuf.ProtobufAPIVersion_2 {}
  typealias Version = _2
}

/// Input data necessary to create a signed transaction.
public struct TW_Ontology_Proto_SigningInput {
  // SwiftProtobuf.Message conformance is added in an extension below. See the
  // `Message` and `Message+*Additions` files in the SwiftProtobuf library for
  // methods supported on all messages.

  public var contract: String = String()

  public var method: String = String()

  public var ownerPrivateKey: Data = SwiftProtobuf.Internal.emptyData

  /// base58 encode address string (160-bit number)
  public var toAddress: String = String()

  public var amount: UInt64 = 0

  public var payerPrivateKey: Data = SwiftProtobuf.Internal.emptyData

  public var gasPrice: UInt64 = 0

  public var gasLimit: UInt64 = 0

  /// base58 encode address string (160-bit number)
  public var queryAddress: String = String()

  public var nonce: UInt32 = 0

  public var unknownFields = SwiftProtobuf.UnknownStorage()

  public init() {}
}

/// Transaction signing output.
public struct TW_Ontology_Proto_SigningOutput {
  // SwiftProtobuf.Message conformance is added in an extension below. See the
  // `Message` and `Message+*Additions` files in the SwiftProtobuf library for
  // methods supported on all messages.

  /// Signed and encoded transaction bytes.
  public var encoded: Data = SwiftProtobuf.Internal.emptyData

  public var unknownFields = SwiftProtobuf.UnknownStorage()

  public init() {}
}

// MARK: - Code below here is support for the SwiftProtobuf runtime.

fileprivate let _protobuf_package = "TW.Ontology.Proto"

extension TW_Ontology_Proto_SigningInput: SwiftProtobuf.Message, SwiftProtobuf._MessageImplementationBase, SwiftProtobuf._ProtoNameProviding {
  public static let protoMessageName: String = _protobuf_package + ".SigningInput"
  public static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
    1: .same(proto: "contract"),
    2: .same(proto: "method"),
    3: .standard(proto: "owner_private_key"),
    4: .standard(proto: "to_address"),
    5: .same(proto: "amount"),
    6: .standard(proto: "payer_private_key"),
    7: .standard(proto: "gas_price"),
    8: .standard(proto: "gas_limit"),
    9: .standard(proto: "query_address"),
    10: .same(proto: "nonce"),
  ]

  public mutating func decodeMessage<D: SwiftProtobuf.Decoder>(decoder: inout D) throws {
    while let fieldNumber = try decoder.nextFieldNumber() {
      switch fieldNumber {
      case 1: try decoder.decodeSingularStringField(value: &self.contract)
      case 2: try decoder.decodeSingularStringField(value: &self.method)
      case 3: try decoder.decodeSingularBytesField(value: &self.ownerPrivateKey)
      case 4: try decoder.decodeSingularStringField(value: &self.toAddress)
      case 5: try decoder.decodeSingularUInt64Field(value: &self.amount)
      case 6: try decoder.decodeSingularBytesField(value: &self.payerPrivateKey)
      case 7: try decoder.decodeSingularUInt64Field(value: &self.gasPrice)
      case 8: try decoder.decodeSingularUInt64Field(value: &self.gasLimit)
      case 9: try decoder.decodeSingularStringField(value: &self.queryAddress)
      case 10: try decoder.decodeSingularUInt32Field(value: &self.nonce)
      default: break
      }
    }
  }

  public func traverse<V: SwiftProtobuf.Visitor>(visitor: inout V) throws {
    if !self.contract.isEmpty {
      try visitor.visitSingularStringField(value: self.contract, fieldNumber: 1)
    }
    if !self.method.isEmpty {
      try visitor.visitSingularStringField(value: self.method, fieldNumber: 2)
    }
    if !self.ownerPrivateKey.isEmpty {
      try visitor.visitSingularBytesField(value: self.ownerPrivateKey, fieldNumber: 3)
    }
    if !self.toAddress.isEmpty {
      try visitor.visitSingularStringField(value: self.toAddress, fieldNumber: 4)
    }
    if self.amount != 0 {
      try visitor.visitSingularUInt64Field(value: self.amount, fieldNumber: 5)
    }
    if !self.payerPrivateKey.isEmpty {
      try visitor.visitSingularBytesField(value: self.payerPrivateKey, fieldNumber: 6)
    }
    if self.gasPrice != 0 {
      try visitor.visitSingularUInt64Field(value: self.gasPrice, fieldNumber: 7)
    }
    if self.gasLimit != 0 {
      try visitor.visitSingularUInt64Field(value: self.gasLimit, fieldNumber: 8)
    }
    if !self.queryAddress.isEmpty {
      try visitor.visitSingularStringField(value: self.queryAddress, fieldNumber: 9)
    }
    if self.nonce != 0 {
      try visitor.visitSingularUInt32Field(value: self.nonce, fieldNumber: 10)
    }
    try unknownFields.traverse(visitor: &visitor)
  }

  public static func ==(lhs: TW_Ontology_Proto_SigningInput, rhs: TW_Ontology_Proto_SigningInput) -> Bool {
    if lhs.contract != rhs.contract {return false}
    if lhs.method != rhs.method {return false}
    if lhs.ownerPrivateKey != rhs.ownerPrivateKey {return false}
    if lhs.toAddress != rhs.toAddress {return false}
    if lhs.amount != rhs.amount {return false}
    if lhs.payerPrivateKey != rhs.payerPrivateKey {return false}
    if lhs.gasPrice != rhs.gasPrice {return false}
    if lhs.gasLimit != rhs.gasLimit {return false}
    if lhs.queryAddress != rhs.queryAddress {return false}
    if lhs.nonce != rhs.nonce {return false}
    if lhs.unknownFields != rhs.unknownFields {return false}
    return true
  }
}

extension TW_Ontology_Proto_SigningOutput: SwiftProtobuf.Message, SwiftProtobuf._MessageImplementationBase, SwiftProtobuf._ProtoNameProviding {
  public static let protoMessageName: String = _protobuf_package + ".SigningOutput"
  public static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
    1: .same(proto: "encoded"),
  ]

  public mutating func decodeMessage<D: SwiftProtobuf.Decoder>(decoder: inout D) throws {
    while let fieldNumber = try decoder.nextFieldNumber() {
      switch fieldNumber {
      case 1: try decoder.decodeSingularBytesField(value: &self.encoded)
      default: break
      }
    }
  }

  public func traverse<V: SwiftProtobuf.Visitor>(visitor: inout V) throws {
    if !self.encoded.isEmpty {
      try visitor.visitSingularBytesField(value: self.encoded, fieldNumber: 1)
    }
    try unknownFields.traverse(visitor: &visitor)
  }

  public static func ==(lhs: TW_Ontology_Proto_SigningOutput, rhs: TW_Ontology_Proto_SigningOutput) -> Bool {
    if lhs.encoded != rhs.encoded {return false}
    if lhs.unknownFields != rhs.unknownFields {return false}
    return true
  }
}
