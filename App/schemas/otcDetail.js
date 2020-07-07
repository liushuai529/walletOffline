export function findOtcList({ id, skip, limit }) {
  return `{
    find_legalDeal(
        skip: ${skip * limit},
        limit: ${limit},
        where: {
            creater_id: ${id}
        },
        order: "-createdAt"
    ){
        id
        direct
        dealPrice
        quantity
        status
        createrPayinfo
        traderPayinfo
        isAllege
        createdAt
    }
}`
}

export function findOtcReceiverInfo(id) {
  return `{
        find_legalDeal(
        where:{
          id: ${id},
        }){
            id,
            dealPrice
            quantity
            traderPayinfo,
            createrPayinfo,
        }
      }`
}
