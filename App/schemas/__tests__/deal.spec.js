import findListSelf from '../deal'

describe('find_deal schema', () => {
  it('find_deal schema should pass', () => {
    const uid = 123
    expect(findListSelf(uid)).toEqual(`{
    find_deal(
        skip: 0,
        limit: 10,
        where: {
          or:[{
            buyer_id: 123
          },{
            seller_id: 123
          }]
        },
        order: "-createdAt"
    ){
        id
        dealPrice
        quantity
        buyerFee
        sellerFee
        createdAt
        currency{
          id
            name
        },
        goods{
          id
            name
        }
        buyer{
          id
          name
        }
        seller{
          id
          name
        }

    }
}`)
  })
})
