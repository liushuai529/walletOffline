import findAddress from '../address'

describe('address schema', () => {
  it('findAddress(1)', () => {
    expect(findAddress(1)).toEqual(`{
    find_address(
        skip: 0,
        limit: 10,
        where:{
          user_id: 1
        }
        order: "-createdAt"
    ){
        id,
        withdrawaddr,
        remark
        token{
          id
          name
        }
        createdAt
    }
  }`)
  })
})
