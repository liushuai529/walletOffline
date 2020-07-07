import findAssetList from '../asset'

describe('asset schema', () => {
  it('schema should pass', () => {
    const uid = 123
    expect(findAssetList(uid)).toEqual(`{
    find_asset(
    where:{
      user_id: 123
    }){
        id,
        amount,
        freezed,
        rechargeaddr,
        totalRechargeAmount,
        token{
          id
          name
        }
        createdAt
    }
  }`)
  })
})
