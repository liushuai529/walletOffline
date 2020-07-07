import {
  findDelegateSelfCurrent,
  findDelegateSelfCurrentWithGoodsId,
  findDelegateSelfHistory,
} from '../delegate'

describe('delegate schemas', () => {
  it('findDelegateSelfCurrent schema should pass', () => {
    const id = 1
    const skip = 2
    const limit = 10

    expect(findDelegateSelfCurrent(id, skip, limit)).toEqual(`{
    find_delegate(
        skip: ${skip},
        limit: ${limit},
        where: {
            user_id: ${id},
            status:{
                in: ["waiting","dealing"]
            }
        },
        order: "-createdAt"
    ){
        id
        direct
        price
        status
        quantity
        dealled
        dealamount
        createdAt
        currency{
            id
            name
        },
        goods{
            id
            name
        }
    }
}`)
  })

  it('findDelegateSelfCurrentWithGoodsId schema should pass', () => {
    const id = 1
    const goodsId = 3
    const currencyId = 5
    expect(findDelegateSelfCurrentWithGoodsId(id, goodsId, currencyId)).toEqual(`{
    find_delegate(
        skip: 0,
        limit: 2,
        where: {
            user_id: ${id},
            goods_id: ${goodsId},
            currency_id: ${currencyId},
            status:{
                in: ["waiting","dealing"]
            }
        },
        order: "-createdAt"
    ){
        id
        direct
        price
        status
        quantity
        dealled
        dealamount
        createdAt
        currency{
            id
            name
        },
        goods{
            id
            name
        }
    }
}`)
  })

  it('findDelegateSelfHistory schema should pass', () => {
    const id = 1
    const skip = 2
    const limit = 10

    expect(findDelegateSelfHistory(id, skip, limit)).toEqual(`{
    find_delegate(
        skip: ${skip},
        limit: ${limit},
        where: {
            user_id: ${id},
            status:{
                in: ["complete", "cancel", "canceling"]
            }
        },
        order: "-createdAt"
    ){
        id
        direct
        price
        status
        quantity
        dealled
        dealamount
        createdAt
        currency{
            id
            name
        },
        goods{
            id
            name
        }
    }
}`)
  })
})
