import findBanners from '../banners'

describe('banners schema', () => {
  it('findbanners schema should pass', () => {
    expect(findBanners()).toEqual(`{
    find_banners{
        id,
        hyperlink,
        imghash,
        createdAt
    }
}`)
  })
})
