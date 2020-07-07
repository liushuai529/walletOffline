import findAnnouncement from '../announcement'

describe('announcement schema', () => {
  it('schema should pass', () => {
    expect(findAnnouncement()).toEqual(`{
    find_announcement{
        id,
          title,
          content,
          imghash,
          createdAt
    }
  }`)
  })
})
