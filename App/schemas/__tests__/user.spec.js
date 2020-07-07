import findUser from '../user'

describe('use schema', () => {
  it('find user should pass', () => {
    const uid = 1

    expect(findUser(uid)).toEqual(`{
    user(id:"${uid}"){
        id,
        name,
        idNo,
        idCardAuthStatus,
        idCardImages,
        mobile,
        email,
        emailStatus,
        status,
        role,
        bankNo,
        bankName,
        subbankName,
        alipay,
        googleSecret,
        prefixNo,
        levelName,
        recommendId,
        createdAt
    }
}`)
  })
})
