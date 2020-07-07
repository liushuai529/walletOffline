export default function findListSelf(id) {
  return `{
    find_deal(
        skip: 0,
        limit: 10,
        where: {
          or:[{
            buyer_id: ${id}
          },{
            seller_id: ${id}
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
}`
}
