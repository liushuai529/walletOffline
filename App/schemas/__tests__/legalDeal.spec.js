import findLegalDeal from '../legalDeal'

describe('legalDeal schemas', () => {
  it('legalDeal schema should pass', () => {
    const id = 1
    const skip = 2
    const limit = 10

    expect(findLegalDeal(id, skip, limit)).toEqual(`{
      find_legalDeal(
          skip: ${skip},
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
          createdAt
      }
  }`)
  })
})
