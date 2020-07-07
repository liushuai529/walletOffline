import {
  findPaymentListRecharge,
  findPaymentListWithdraw,
} from '../payment'

describe('payment schema', () => {
  it('findPaymentListRecharge should pass', () => {
    const uid = 1
    const skip = 2
    const limit = 10

    expect(findPaymentListRecharge(uid, skip, limit)).toEqual(`{
    find_payment(
        skip: ${skip},
        limit: ${limit},
        where: {
          user_id: ${uid},
          type: "recharge"
        },
        order: "-createdAt"
    ){
        id
        fromaddr
        toaddr
        type
        status
        amount
        reachtime
        extend
        createdAt
        token{
          id
          name
        }
    }
}`)
  })

  it('findPaymentListWithdraw should pass', () => {
    const uid = 1
    const skip = 2
    const limit = 10

    expect(findPaymentListWithdraw(uid, skip, limit)).toEqual(`{
    find_payment(
        skip: ${skip},
        limit: ${limit},
        where: {
          user_id: ${uid},
          type: "withdraw"
        },
        order: "-createdAt"
    ){
        id
        fromaddr
        toaddr
        type
        status
        amount
        reachtime
        extend
        createdAt
        token{
          id
          name
        }
    }
}`)
  })
})
